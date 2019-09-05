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

describe('core dispatch flow', () => {
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
    let afterCntr = 2
    regFx('custom', (_, amount) => {
      afterCntr = afterCntr + amount
    })
    regEventFx(evt.MESSAGE, (_, message) => [
      dbFx(updateIn(['messages'], R.append(message))),
      dispatchFx(evt.SUBEVENT, message),
      dbFx(updateIn(['messages'], R.append('end')))
    ])
    regEventFx(evt.SUBEVENT, (_, message) => [
      dbFx(updateIn(['messages'], R.append(`sub ${message}`))),
      ['custom', 5]
    ])
    dispatch(evt.MESSAGE, 'hello')
    expect(getState()).toEqual({ 'messages': ['hello', 'sub hello', 'end'] })
    expect(afterCntr).toEqual(7)
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
      dbFx(R.assoc('message', message))
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

  it('should process db effects and make reductions available to non-listeners', () => {
    const { regEventFx, dispatch, subscribeToState } = createStore()
    let nNotifications = 0
    const nEvents = 5
    const reduced = { 'messages': R.times((n) => 'event-' + n, nEvents) }
    const reductions = n => R.map((n2) => 'event-' + n2, R.range(0, n))

    subscribeToState(db => {
      expect(db).toEqual(reduced)
      nNotifications += 1
    })

    R.map(n => {
      regEventFx('event-' + n, ({ db, eventName }) => {
        if (n > 0) {
          expect(db.messages).toEqual(reductions(n))
        }
        return [
          ['db', updateIn(['messages'], R.append(eventName))]
        ].concat(
          n < nEvents - 1
          ? [['dispatch', ['event-' + R.inc(n)]]]
          : []
        )
      })
    }, R.range(0, nEvents))

    dispatch('event-0')
    expect(nNotifications).toEqual(1)
  })
})

describe('creation with specified env', () => {
  it('should work', () => {
    const staticFxDef = jest.fn()
    const overwrittenFxDef = jest.fn()
    const { env, regEventFx, regFx, dispatch, subscribeToState } = createStore({
      state: { db: { cool: true } },
      fx: {
        'static-fx': staticFxDef,
        'my-fx': overwrittenFxDef
      },
      eventFx: {
        'my-evt': [({ db }) => {
          expect(db).toEqual({ cool: true })
          return [['db', R.assoc('awesome', true)]]
        }]
      }
    })

    function dynRegister({ db }) {
      expect(db).toEqual({ cool: true, awesome: true })
      return [['my-fx'], ['static-fx']]
    }

    const myFx = jest.fn()

    regEventFx('my-evt', dynRegister)
    regFx('my-fx', myFx)

    dispatch('my-evt')
    expect(staticFxDef).toBeCalled()
    expect(myFx).toBeCalled()
    expect(overwrittenFxDef).not.toBeCalled()

    expect(env.eventFx['my-evt'].length).toEqual(2)
    expect(env.eventFx['my-evt'][1].name).toEqual('dynRegister')
  })
})
