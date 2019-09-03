import * as R from 'ramda'
import { createStore } from './createStore'

const evt = {
  MESSAGE: 'message',
  SUBEVENT: 'subevent'
}

export const updateIn = R.curry((ks, f, m) =>
  R.assocPath(ks, f(R.path(ks, m)), m)
)
const dbFx = reducerOrState => ['db', reducerOrState]
const dispatchFx = (type, payload) => ['dispatch', [type, payload]]

it('should reduce a simple event', () => {
  const { regEventFx, reduceDispatch } = createStore()
  regEventFx(evt.MESSAGE, (_, message) => {
    console.log('enter eventFx', message)
    return [dbFx(R.assoc('message', message))]
  })
  const result = reduceDispatch([evt.MESSAGE, 'hello'])
  expect(result).toEqual({
    'afterFx': [],
    'db': { 'message': 'hello' },
    'lastEventType': 'message',
    'stateIsDirty': true
  })
})
it('should process dispatch child event synchronously', () => {
  const { regEventFx, reduceDispatch } = createStore()
  regEventFx(evt.MESSAGE, (_, message) => [
    dbFx(updateIn(['messages'], R.append(message))),
    dispatchFx(evt.SUBEVENT, message),
    dbFx(updateIn(['messages'], R.append('end')))
  ])
  regEventFx(evt.SUBEVENT, (_, message) => [
    dbFx(updateIn(['messages'], R.append(`sub ${message}`)))
  ])
  const result = reduceDispatch([evt.MESSAGE, 'hello'])
  expect(result).toEqual({
    'afterFx': [],
    'db': { 'messages': ['hello', 'sub hello', 'end'] },
    'lastEventType': 'subevent',
    'stateIsDirty': true
  })
})
it('should permit custom fx and those can chain', () => {
  const { regFx, regEventFx, reduceDispatch } = createStore()
  let afterCntr = 0
  regFx('custom', () => {
    afterCntr++
  })
  regEventFx(evt.MESSAGE, (_, message) => [
    dbFx(updateIn(['messages'], R.append(message))),
    dispatchFx(evt.SUBEVENT, message),
    dbFx(updateIn(['messages'], R.append('end')))
  ])
  regEventFx(evt.SUBEVENT, (_, message) => [
    dbFx(updateIn(['messages'], R.append(`sub ${message}`))),
    ['custom', 'yep']
  ])
  const result = reduceDispatch([evt.MESSAGE, 'hello'])
  expect(R.omit(['afterFx'], result)).toEqual({
    'db': { 'messages': ['hello', 'sub hello', 'end'] },
    'lastEventType': 'subevent',
    'stateIsDirty': true
  })
  expect(result.afterFx.length).toBe(1)
  expect(afterCntr).toEqual(0)
})

it('should notify subscribers only once and apply afterFx', () => {
  const { regEventFx, regFx, dispatch, subscribeToState } = createStore()
  let stateCntr = 0
  let state = null
  let afterCntr = 0
  subscribeToState(newState => {
    stateCntr++
    state = newState
  })
  regFx('custom', ({ after, lastEventType }, attitude) => {
    afterCntr++
  })
  regEventFx(evt.MESSAGE, (_, message) => [
    dbFx(R.assoc('message', message)),
    dispatchFx(evt.SUBEVENT, message),
    dbFx(R.assoc('done', true))
  ])
  regEventFx(evt.SUBEVENT, (_, message) => [
    ['custom', 'yep'],
    dbFx(updateIn(['messages'], R.append(`sub ${message}`)))
  ])
  dispatch(evt.MESSAGE, 'hello')
  expect(stateCntr).toEqual(1)
  expect(afterCntr).toEqual(1)
  expect(state).toEqual({
    'done': true, 'message': 'hello', 'messages': ['sub hello']
  })
})
