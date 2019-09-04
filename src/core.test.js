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
  const { dispatch, regEventFx, getState } = createStore()
  regEventFx(evt.MESSAGE, (_, message) =>
    [dbFx(R.assoc('message', message))])
  dispatch(evt.MESSAGE, 'hello')
  expect(getState()).toEqual({ message: 'hello' })
})

it('should process dispatch child event synchronously', () => {
  const { dispatch, regEventFx, getState } = createStore()
  regEventFx(evt.MESSAGE, (_, message) => [
    dbFx(updateIn(['messages'], R.append(message))),
    dispatchFx(evt.SUBEVENT, message),
    dbFx(updateIn(['messages'], R.append('end')))
  ])
  regEventFx(evt.SUBEVENT, (_, message) => [
    dbFx(updateIn(['messages'], R.append(`sub ${message}`)))
  ])
  dispatch(evt.MESSAGE, 'hello')
  expect(getState()).toEqual({ 'messages': ['hello', 'sub hello', 'end'] })
})

it('should permit custom fx', () => {
  const { regFx, regEventFx, getState, dispatch } = createStore()
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
  dispatch(evt.MESSAGE, 'hello')
  expect(getState()).toEqual({ 'messages': ['hello', 'sub hello', 'end'] })
  expect(afterCntr).toEqual(1)
})

it('should notify subscribers of state change', () => {
  const { regEventFx, regFx, dispatch, subscribeToState } = createStore()
  let stateCntr = 0
  let state = null
  subscribeToState(newState => {
    stateCntr++
    state = newState
  })
  regEventFx(evt.MESSAGE, (_, message) => [
    dbFx(R.assoc('message', message)),
  ])
  dispatch(evt.MESSAGE, 'hello')
  expect(stateCntr).toEqual(1)
})

it('should notify subscribers only once of state change', () => {
  const { regEventFx, regFx, dispatch, subscribeToState } = createStore()
  let stateCntr = 0
  let state = null
  let customCntr = 0
  subscribeToState(newState => {
    stateCntr++
    state = newState
  })
  regFx('custom', () => {
    customCntr++
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
  // only 1, not 3
  expect(stateCntr).toEqual(1)
  expect(customCntr).toEqual(1)
  expect(state).toEqual({
    'done': true, 'message': 'hello', 'messages': ['sub hello']
  })
})
