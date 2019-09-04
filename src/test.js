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
  const result = reduceDispatch(evt.MESSAGE, 'hello')
  expect(result).toEqual({
    'afterFx': [],
    'db': { 'message': 'hello' },
    'lastEventType': 'message',
    'stateIsDirty': true,
    supplied: [],
    requires: []
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
  const result = reduceDispatch(evt.MESSAGE, 'hello')
  expect(result).toEqual({
    'afterFx': [],
    'db': { 'messages': ['hello', 'sub hello', 'end'] },
    'lastEventType': 'subevent',
    'stateIsDirty': true,
    supplied: [],
    requires: []
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
  const result = reduceDispatch(evt.MESSAGE, 'hello')
  expect(R.omit(['afterFx'], result)).toEqual({
    'db': { 'messages': ['hello', 'sub hello', 'end'] },
    'lastEventType': 'subevent',
    'stateIsDirty': true,
    supplied: [],
    requires: []
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
  regFx('custom', () => {
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

const id = ['id']

it('should block and ask for coeffects', () => {
  const { regEventFx, reduceDispatch } = createStore()
  regEventFx(evt.MESSAGE, { id }, () => {
    throw new Error('Should never get to me (at least how we are handling coeffects now)')
  })
  const next = reduceDispatch(evt.MESSAGE, 'hello')

  expect(next).toEqual({
    afterFx: [], db: {}, requires: [{ id: ['id'] }], supplied: []
  })
})

it('should work all the way through if supplied coeffects', () => {
  const { regEventFx, reduceDispatchStateless } = createStore()
  regEventFx(evt.MESSAGE, { id }, ({ id }) => [
    dbFx(R.assoc('id', id)),
    dbFx(R.assoc('done', true))
  ])
  const next = reduceDispatchStateless({
    db: {},
    requires: [],
    supplied: [{ id: '88' }],
    afterFx: []
  }, [evt.MESSAGE, 'hello'])

  expect(R.omit(['lastEventType'], next)).toEqual({
    afterFx: [],
    db: {
      done: true,
      id: '88'
    },
    stateIsDirty: true,
    requires: [{ id: ['id'] }],
    supplied: [{ id: '88' }],
    supplyIndex: 1
  })
})

it('dispatch should auto-supply coeffects', () => {
  const { regEventFx, dispatch, regSupplier, getState, regAfter } = createStore()
  regEventFx(evt.MESSAGE, { id }, ({ id }) => [
    dbFx(R.assoc('id', id)),
    dbFx(R.assoc('done', true))
  ])
  regSupplier('id', () => '88')
  dispatch(evt.MESSAGE, 'hello')

  expect(getState()).toEqual({
    done: true,
    id: '88'
  })
})

it('dispatch should auto-supply deep coeffects', () => {
  const { regEventFx, regFx, regSupplier, regAfter, dispatch, subscribeToState } = createStore()
  let stateCntr = 0
  let state = null
  let afterCntr = 0
  subscribeToState(newState => {
    stateCntr++
    state = newState
  })
  regAfter((result) => {
    console.log(result)
  })
  regFx('custom', () => {
    afterCntr++
  })
  let idCounter = 10
  regSupplier('id', () => idCounter++)
  regEventFx(evt.MESSAGE, ({ id }), ({ id }, message) => [
    dbFx(R.assoc('message', { id, message })),
    dispatchFx(evt.SUBEVENT, message),
    dbFx(R.assoc('done', true))
  ])
  regEventFx(evt.SUBEVENT, ({ id }), ({ id }, message) => [
    ['custom', 'yep'],
    dbFx(updateIn(['messages'], R.append(`sub ${message} ${id}`)))
  ])
  dispatch(evt.MESSAGE, 'hello')
  expect(stateCntr).toEqual(1)
  expect(afterCntr).toEqual(1)
  expect(state).toEqual({
    'done': true, 'message': {
      id: 10,
      message: 'hello'
    }, 'messages': ['sub hello 11']
  })
})
