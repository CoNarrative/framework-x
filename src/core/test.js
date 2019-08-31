import * as R from 'ramda'
import { createStore } from '.'

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
    'after': [],
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
    'after': [],
    'db': { 'messages': ['hello', 'sub hello', 'end'] },
    'lastEventType': 'subevent',
    'stateIsDirty': true
  })
})
it('should permit custom fx', () => {
  const { regFx, regEventFx, reduceDispatch } = createStore()
  regFx('custom', ({ after, lastEventType }, attitude) => {
    after(() => {
      console.log('I went after!')
    })
    return [dbFx(R.assoc('customStarted', attitude))]
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
  expect(R.omit(['after'], result)).toEqual({
    'db': { 'customStarted': 'yep', 'messages': ['hello', 'sub hello', 'end'] },
    'lastEventType': 'subevent',
    'stateIsDirty': true
  })
  expect(result.after.length).toBe(1)
})
it('custom fx can chain other fx', () => {
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
    'after': [],
    'db': { 'messages': ['hello', 'sub hello', 'end'] },
    'lastEventType': 'subevent',
    'stateIsDirty': true
  })
})

it('should notify subscribers only once', () => {
  const { regEventFx, reduceDispatch } = createStore()
  regEventFx(evt.MESSAGE, (_, message) => [dbFx(R.assoc('message', message))])
  const result = reduceDispatch([evt.MESSAGE, 'hello'])
})
