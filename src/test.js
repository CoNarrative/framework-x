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
// dispatch is now just an inline helper
const subFx = (type, payload) => [type, payload]

describe('core db and dispatch', () => {
  it('should reduce a simple event', () => {
    const { regFreeFx, reduceFxToEnd } = createStore()
    regFreeFx(fx.MESSAGE, (_, message) => {
      return [dbFx(R.assoc('message', message))]
    })
    const sideFx = reduceFxToEnd(fx.MESSAGE, 'hello')
    expect(sideFx).toEqual([['setState', { message: 'hello' }]])
  })
  // it('should process db effects and make reductions available to non-listeners', () => {
  //   const { regFreeFx, dispatch, getState, subscribeToState } = createStore()
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
  //     regFreeFx('event-' + n, ({ db }) => {
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
    const { regFreeFx, reduceFxToEnd } = createStore()
    regFreeFx(fx.MESSAGE, (_, message) => [
      dbFx(updateIn(['messages'], R.append(message))),
      [fx.HELPER, message],
      dbFx(updateIn(['messages'], R.append('end')))
    ])
    regFreeFx(fx.HELPER, (_, message) => [
      dbFx(updateIn(['messages'], R.append(`sub ${message}`)))
    ])
    const sideFx = reduceFxToEnd(fx.MESSAGE, 'hello')
    expect(sideFx).toEqual(
      [['setState', { 'messages': ['hello', 'sub hello', 'end'] }]]
    )
  })
})
describe('setState sidefx', () => {
  it('should notify subscribers only once', () => {
    const { regFreeFx, regSideFx, doFx, subscribeToState } = createStore()
    let stateCntr = 0
    let state = null
    subscribeToState(newState => {
      stateCntr++
      state = newState
    })
    regFreeFx(fx.MESSAGE, (_, message) => [
      dbFx(R.assoc('message', message))
    ])
    doFx(fx.MESSAGE, 'hello')
    expect(stateCntr).toEqual(1)
    expect(state).toEqual({
      'message': 'hello'
    })
  })
})
describe('other side fx', () => {
  it('should record custom sideFx', () => {
    const { regFreeFx, regSideFx, reduceFxToEnd } = createStore()
    let afterCntr = 0

    regFreeFx(fx.MESSAGE, (_, message) => [
      dbFx(updateIn(['messages'], R.append(message))),
      subFx(fx.HELPER, message),
      dbFx(updateIn(['messages'], R.append('end')))
    ])
    regFreeFx(fx.HELPER, (_, message) => [
      dbFx(updateIn(['messages'], R.append(`sub ${message}`))),
      ['custom', 'yep']
    ])
    regSideFx('custom', () => {
      afterCntr++
    })
    const sideFx = reduceFxToEnd(fx.MESSAGE, 'hello')
    expect(sideFx).toEqual([
      ['custom', 'yep'],
      ['setState', { messages: ['hello', 'sub hello', 'end'] }
      ]])
    expect(afterCntr).toEqual(0)
  })
  it('should handle mix of setState and other sideFx', () => {
    const { regFreeFx, regSideFx, doFx, subscribeToState } = createStore()
    let stateCntr = 0
    let state = null
    let afterCntr = 0
    subscribeToState(newState => {
      stateCntr++
      state = newState
    })
    regSideFx('custom', () => {
      afterCntr++
    })
    regFreeFx(fx.MESSAGE, (_, message) => [
      dbFx(R.assoc('message', message)),
      subFx(fx.HELPER, message),
      dbFx(R.assoc('done', true))
    ])
    regFreeFx(fx.HELPER, (_, message) => [
      ['custom', 'yep'],
      dbFx(updateIn(['messages'], R.append(`sub ${message}`)))
    ])
    doFx(fx.MESSAGE, 'hello')
    expect(stateCntr).toEqual(1)
    expect(afterCntr).toEqual(1)
    expect(state).toEqual({
      'done': true, 'message': 'hello', 'messages': ['sub hello']
    })
  })
})

describe('supplies coeffects', () => {
  const id = ['id']
  it('should block and ask for coeffects', () => {
    const { regFreeFx, reduceFx } = createStore()
    regFreeFx(fx.MESSAGE, { id }, () => {
      throw new Error('Should never get to me (at least how we are handling coeffects now)')
    })
    const next = reduceFx(undefined, [fx.MESSAGE, 'hello'])

    expect(next).toEqual({
      db: {}, fault: true, sideFx: [], requires: [{ id: ['id'] }], supplied: []
    })
  })

  it('should work all the way through if supplied coeffects', () => {
    const { regFreeFx, reduceFx } = createStore()
    regFreeFx(fx.MESSAGE, { id }, ({ id }) => [
      dbFx(R.assoc('id', id)),
      dbFx(R.assoc('done', true))
    ])
    const next = reduceFx({
      db: {},
      requires: [],
      supplied: [{ id: '88' }],
      sideFx: []
    }, [fx.MESSAGE, 'hello'])

    expect(R.omit(['lastFxType'], next)).toEqual({
      db: {
        done: true,
        id: '88'
      },
      requires: [{ id: ['id'] }],
      supplied: [{ id: '88' }],
      sideFx: [],
      supplyIndex: 1
    })
  })

  it('dispatch should auto-supply coeffects', () => {
    const { regFreeFx, doFx, regSupplier, getState } = createStore()
    regFreeFx(fx.MESSAGE, { id }, ({ id }) => [
      dbFx(R.assoc('id', id)),
      dbFx(R.assoc('done', true))
    ])
    regSupplier('id', () => '88')
    doFx(fx.MESSAGE, 'hello')

    expect(getState()).toEqual({
      done: true,
      id: '88'
    })
  })

  it('dispatch should auto-supply deep coeffects', () => {
    const { regFreeFx, regSupplier, dispatch, subscribeToState } = createStore()
    let stateCntr = 0
    let state = null
    let afterCntr = 0
    subscribeToState(newState => {
      stateCntr++
      state = newState
    })
    regFreeFx('custom', () => {
      afterCntr++
    })
    let idCounter = 10
    regSupplier('id', () => idCounter++)
    regFreeFx(fx.MESSAGE, ({ id }), ({ id }, message) => [
      dbFx(R.assoc('message', { id, message })),
      subFx(fx.HELPER, message),
      dbFx(R.assoc('done', true))
    ])
    regFreeFx(fx.HELPER, ({ id }), ({ id }, message) => [
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
    const { regFreeFx, regAppendFx, regReduceFx, regSupplier, regSideFx, reduceFxSupply, doFx } = createStore()

    /** SETUP LOCAL STORAGE **/
    const localStorage = {}
    /* persist in unit-of-work cache */
    regReduceFx('writeKey', (acc, [key, value]) =>
      R.assocPath(['localStorage', key], value, acc))
    /* return from unit-of-work cache or do side-effecty read */
    /* the point of the cache is not perf but to pick up any unit-of-work writeKey */
    regSupplier('readKey', (acc, key) => {
      return R.path(['localStorage', key], acc) || localStorage[key]
    })
    /* rewrite into single batch for clarity */
    regAppendFx('writeKeys', R.pipe(
      R.prop('localStorage'),
      R.toPairs
    ))
    /* register the actual sidefx */
    regSideFx('writeKeys', R.forEach(([key, value]) => {
      localStorage[key] = value
    }))

    regFreeFx(fx.MESSAGE, (_, message) => [
      ['writeKey', ['id', 'fooId']],
      subFx(fx.HELPER),
      ['writeKey', ['id', 'barId']],
      subFx(fx.HELPER),
      dbFx(R.assoc('done', true))
    ])
    regFreeFx(fx.HELPER,
      ({ id: ['readKey', 'id'] }),
      ({ id }) => [
        dbFx(updateIn(['ids'], R.append(id)))
      ])

    /** GO **/
    const result = reduceFxSupply(fx.MESSAGE)

    expect(result).toEqual([
      ['setState', {'done': true, 'ids': ['fooId', 'barId']}],
      ['writeKeys', [['id', 'barId']]]
    ])
    expect(localStorage).toEqual({})
    doFx(fx.MESSAGE)
    expect(localStorage).toEqual({
      'id': 'barId'
    })
  })
})
