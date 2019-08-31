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
  regEventFx(evt.MESSAGE, (_, message) => [dbFx(R.assoc('message', message))])
  const result = reduceDispatch([evt.MESSAGE, 'hello'])
  expect(result).toEqual({ 'db': { 'message': 'hello' }, 'fx': {} })
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
  expect(result).toEqual({db: {messages: ['hello', 'sub hello', 'end']}, 'fx': {}})
})

it('should notify subscribers only once', () => {
  const { regEventFx, reduceDispatch } = createStore()
  regEventFx(evt.MESSAGE, (_, message) => [dbFx(R.assoc('message', message))])
  const result = reduceDispatch([evt.MESSAGE, 'hello'])
  expect(result).toEqual({ 'db': { 'message': 'hello' }, 'fx': {} })
})
