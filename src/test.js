/* eslint-disable no-undef */
import * as R from 'ramda'
import { createStore } from './createStore'

const fx = {
  MESSAGE: 'message',
  HELPER: 'subevent'
}

export const updateIn = R.curry((ks, f, m) =>
  R.assocPath(ks, f(R.path(ks, m)), m)
)
const dbFx = reducerOrState => ['db', reducerOrState]
const dispatchFx = (type, payload) => ['dispatch', [type, payload]]

describe('core db and dispatch', () => {
  it('should reduce a simple event', () => {
    const { regFx, reduceFxToEnd } = createStore()
    regFx(fx.MESSAGE, (_, message) => {
      return [dbFx(R.assoc('message', message))]
    })
    const sideFx = reduceFxToEnd(fx.MESSAGE, 'hello')
    expect(sideFx).toEqual([['setState', { message: 'hello' }]])
  })
  // it('should process db effects and make reductions available to non-listeners', () => {
  //   const { regEventFx, dispatch, getState, subscribeToState } = createStore()
  //   let nNotifications = 0
  //   const nEvents = 5
  //   const reduced = { 'messages': R.times((n) => 'event-' + n, nEvents) }
  //   const reductions = n => R.map((n2) => 'event-' + n2, R.range(0, n))
  //
  //   subscribeToState(db => {
  //     expect(db).toEqual(reduced)
  //     nNotifications += 1
  //   })
  //
  //   R.map(n => {
  //     regEventFx('event-' + n, ({ db }) => {
  //       if (n > 0) {
  //         try {
  //           expect(db.messages).toEqual(reductions(n))
  //         } catch (e) {
  //           console.log('e', e)
  //         }
  //       }
  //       return [
  //         ['db', updateIn(['messages'], R.append('event-' + n))]
  //       ].concat(
  //         n < nEvents - 1
  //           ? [['dispatch', ['event-' + R.inc(n)]]]
  //           : []
  //       )
  //     })
  //   }, R.range(0, nEvents))
  //
  //   dispatch('event-0')
  //   expect(getState()).toEqual(reduced)
  //   expect(nNotifications).toEqual(1)
  // })
  it('should process dispatch child event synchronously and update db along the way', () => {
    const { regFx, reduceFxToEnd } = createStore()
    regFx(fx.MESSAGE, (_, message) => [
      dbFx(updateIn(['messages'], R.append(message))),
      [fx.HELPER, message],
      dbFx(updateIn(['messages'], R.append('end')))
    ])
    regFx(fx.HELPER, (_, message) => [
      dbFx(updateIn(['messages'], R.append(`sub ${message}`)))
    ])
    const sideFx = reduceFxToEnd(fx.MESSAGE, 'hello')
    expect(sideFx).toEqual(
      [['setState', { 'messages': ['hello', 'sub hello', 'end'] }]]
    )
  })
})
describe('custom fx', () => {
  it('should permit custom fx and those can chain', () => {
    const { regFx, regEventFx, reduceDispatch } = createStore()
    let afterCntr = 0
    regFx('custom', () => {
      afterCntr++
    })
    regEventFx(fx.MESSAGE, (_, message) => [
      dbFx(updateIn(['messages'], R.append(message))),
      dispatchFx(fx.HELPER, message),
      dbFx(updateIn(['messages'], R.append('end')))
    ])
    regEventFx(fx.HELPER, (_, message) => [
      dbFx(updateIn(['messages'], R.append(`sub ${message}`))),
      ['custom', 'yep']
    ])
    const result = reduceDispatch(fx.MESSAGE, 'hello')
    expect(result).toEqual({
      'db': { 'messages': ['hello', 'sub hello', 'end'] },
      'lastEventType': 'subevent',
      supplied: [],
      requires: [],
      afterFx: [['custom', 'yep']]
    })
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
    regEventFx(fx.MESSAGE, (_, message) => [
      dbFx(R.assoc('message', message)),
      dispatchFx(fx.HELPER, message),
      dbFx(R.assoc('done', true))
    ])
    regEventFx(fx.HELPER, (_, message) => [
      ['custom', 'yep'],
      dbFx(updateIn(['messages'], R.append(`sub ${message}`)))
    ])
    dispatch(fx.MESSAGE, 'hello')
    expect(stateCntr).toEqual(1)
    expect(afterCntr).toEqual(1)
    expect(state).toEqual({
      'done': true, 'message': 'hello', 'messages': ['sub hello']
    })
  })

  it('should permit custom immediate fx to change db', () => {
    const { regReduceFx, regEventFx, reduceDispatch, reduceFx } = createStore()
    regReduceFx('custom', acc => reduceFx(acc, [dbFx(R.assoc('foo', 'bar'))]))
    regEventFx(fx.MESSAGE, (_, message) => [
      dbFx(updateIn(['messages'], R.append(message))),
      dispatchFx(fx.HELPER, message),
      dbFx(updateIn(['messages'], R.append('end')))
    ])
    regEventFx(fx.HELPER, (_, message) => [
      dbFx(updateIn(['messages'], R.append(`sub ${message}`))),
      ['custom', 'yep']
    ])
    const result = reduceDispatch(fx.MESSAGE, 'hello')
    expect(result).toEqual({
      'db': { 'messages': ['hello', 'sub hello', 'end'], foo: 'bar' },
      'lastEventType': 'subevent',
      supplied: [],
      requires: [],
      afterFx: []
    })
    expect(result.afterFx.length).toBe(0)
  })
})

describe('supplies coeffects', () => {
  const id = ['id']
  it('should block and ask for coeffects', () => {
    const { regEventFx, reduceDispatch } = createStore()
    regEventFx(fx.MESSAGE, { id }, () => {
      throw new Error('Should never get to me (at least how we are handling coeffects now)')
    })
    const next = reduceDispatch(fx.MESSAGE, 'hello')

    expect(next).toEqual({
      afterFx: [], db: {}, requires: [{ id: ['id'] }], supplied: []
    })
  })

  it('should work all the way through if supplied coeffects', () => {
    const { regEventFx, reduceDispatchStateless } = createStore()
    regEventFx(fx.MESSAGE, { id }, ({ id }) => [
      dbFx(R.assoc('id', id)),
      dbFx(R.assoc('done', true))
    ])
    const next = reduceDispatchStateless({
      db: {},
      requires: [],
      supplied: [{ id: '88' }],
      afterFx: []
    }, [fx.MESSAGE, 'hello'])

    expect(R.omit(['lastEventType'], next)).toEqual({
      afterFx: [],
      db: {
        done: true,
        id: '88'
      },
      requires: [{ id: ['id'] }],
      supplied: [{ id: '88' }],
      supplyIndex: 1
    })
  })

  it('dispatch should auto-supply coeffects', () => {
    const { regEventFx, dispatch, regSupplier, getState } = createStore()
    regEventFx(fx.MESSAGE, { id }, ({ id }) => [
      dbFx(R.assoc('id', id)),
      dbFx(R.assoc('done', true))
    ])
    regSupplier('id', () => '88')
    dispatch(fx.MESSAGE, 'hello')

    expect(getState()).toEqual({
      done: true,
      id: '88'
    })
  })

  it('dispatch should auto-supply coeffects', () => {
    const { regEventFx, dispatch, regSupplier, getState } = createStore()
    regEventFx(fx.MESSAGE, { id }, ({ id }) => [
      dbFx(R.assoc('id', id)),
      dbFx(R.assoc('done', true))
    ])
    regSupplier('id', () => '88')
    dispatch(fx.MESSAGE, 'hello')

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
    regFx('custom', () => {
      afterCntr++
    })
    let idCounter = 10
    regSupplier('id', () => idCounter++)
    regEventFx(fx.MESSAGE, ({ id }), ({ id }, message) => [
      dbFx(R.assoc('message', { id, message })),
      dispatchFx(fx.HELPER, message),
      dbFx(R.assoc('done', true))
    ])
    regEventFx(fx.HELPER, ({ id }), ({ id }, message) => [
      ['custom', 'yep'],
      dbFx(updateIn(['messages'], R.append(`sub ${message} ${id}`)))
    ])
    dispatch(fx.MESSAGE, 'hello')
    expect(stateCntr).toEqual(1)
    expect(afterCntr).toEqual(1)
    expect(state).toEqual({
      'done': true,
      'message': {
        id: 10,
        message: 'hello'
      },
      'messages': ['sub hello 11']
    })
  })

  it('should pass in accumulator and args to coeffect (simulated localStorage)', () => {
    const { regEventFx, regAfter, regReduceFx, regSupplier, reduceDispatchSupply, dispatch } = createStore()

    /** SETUP LOCAL STORAGE **/
    const localStorage = {}
    /* persist in unit-of-work cache */
    regReduceFx('writeKey', (acc, [key, value]) =>
      R.assocPath(['localStorage', key], value, acc))
    /* flush all local storage keys when done */
    // NOTE: This way we lose the "afterFx in order" and have to know that "localStorage"
    // is a set of instructions in its own right
    // this is an example of a batch operation -- for local storage not needed, but
    // for graphql, etc. could be useful
    regAfter('writeKey', R.pipe(
      R.prop('localStorage'),
      R.toPairs,
      R.forEach(([key, value]) => {
        localStorage[key] = value
      })
    ))
    /* return from unit-of-work cache or do side-effecty read */
    /* the point of the cache is not perf but to pick up any unit-of-work writeKey */
    regSupplier('readKey', (acc, key) => {
      return R.path(['localStorage', key], acc) || localStorage[key]
    })
    regEventFx(fx.MESSAGE, (_, message) => [
      ['writeKey', ['id', 'fooId']],
      dispatchFx(fx.HELPER),
      ['writeKey', ['id', 'barId']],
      dispatchFx(fx.HELPER),
      dbFx(R.assoc('done', true))
    ])
    regEventFx(fx.HELPER,
      ({ id: ['readKey', 'id'] }),
      ({ id }) => [
        dbFx(updateIn(['ids'], R.append(id)))
      ])

    /** GO **/
    const result = reduceDispatchSupply(fx.MESSAGE)
    expect(result).toEqual({
      requires: [{ id: ['readKey', 'id'] }, { id: ['readKey', 'id'] }],
      afterFx: [],
      db: { ids: ['fooId', 'barId'], done: true },
      supplied:
        [{
          id: 'fooId'
        }, {
          id: 'barId'
        }],
      lastEventType: 'subevent',
      localStorage: { id: 'barId' },
      supplyIndex: 2
    })
    expect(localStorage).toEqual({})
    dispatch(fx.MESSAGE)
    expect(localStorage).toEqual({
      'id': 'barId'
    })
  })
})
