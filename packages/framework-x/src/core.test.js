import * as R from 'ramda'
import { createStore, defaultEnv } from './createStore'
import { derive } from './util'

const evt = {
  MESSAGE: 'message',
  SUBEVENT: 'subevent'
}

const updateIn = R.curry((ks, f, m) =>
  R.assocPath(ks, f(R.path(ks, m)), m)
)
const dbFx = reducerOrState => ['db', reducerOrState]
const dispatchFx = (type, payload) => ['dispatch', [type, payload]]

describe('core/createStore', () => {
  it('should have default effects if not provided', () => {
    const { env } = createStore()
    const def = defaultEnv()
    expect(R.intersection(
      R.keys(def.fx),
      R.keys(env.fx)))
      .toEqual(R.keys(def.fx))
  })
  it('should have default effects if custom effects provided', () => {
    const fx = { 'foo': () => {} }
    const { env } = createStore({ fx })
    const expected = R.concat(R.keys(defaultEnv().fx), R.keys(fx))
    expect(R.intersection(R.keys(env.fx), expected)).toEqual(expected)
  })
  it('supports dynamic and static fx and eventFx definitions', () => {
    const staticFxDef = jest.fn()
    const overwrittenFxDef = jest.fn()
    const { env, regEventFx, regFx, dispatch } = createStore({
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

describe('core/setState', () => {
  it('should set and notify by default', () => {
    let stateNotifs = []
    const { env, setState } = createStore({ dbListeners: [x => stateNotifs.push(x)] })
    setState({ cool: true })
    expect(env.state.db).toEqual({ cool: true })
    expect(stateNotifs.length).toEqual(1)
    expect(stateNotifs[0]).toEqual({ cool: true })
  })

  it('should apply a reducer fn', () => {
    let stateNotifs = []
    const { env, setState } = createStore({
      state: { db: { cool: false } },
      dbListeners: [x => stateNotifs.push(x)]
    })
    setState(R.assoc('cool', true))
    expect(env.state.db).toEqual({ cool: true })
    expect(stateNotifs.length).toEqual(1)
    expect(stateNotifs[0]).toEqual({ cool: true })
  })

  it('should optionally bypass db listener notification', () => {
    let stateNotifs = []
    const { env, setState } = createStore({
      state: { db: { cool: false } },
      dbListeners: [x => stateNotifs.push(x)]
    })
    setState(R.assoc('cool', true), false)
    expect(env.state.db).toEqual({ cool: true })
    expect(stateNotifs.length).toEqual(0)
  })
})

describe('core/fx.apply', () => {
  it('should return a list of effect descriptions when f returns null or undefined', () => {
    const { env } = createStore()
    const inputEffects = [['setState'], { foo: 'bar' }]
    const effects = env.fx.apply(env, R.always(undefined), inputEffects)
    const effects2 = env.fx.apply(env, R.always(null), inputEffects)
    expect(effects).toEqual(inputEffects)
    expect(effects2).toEqual(inputEffects)
  })
})

describe('core/dispatch', () => {
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
    const { regEventFx, dispatch, subscribeToState } = createStore()
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
      const eventName = 'event-' + n
      regEventFx(eventName, ({ db }) => {
        if (n > 0) {
          try {
            expect(db.messages).toEqual(reductions(n))
          } catch (e) {
            console.log('e', e)
          }
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

  it('should steal execution when called from an effect during effect processing', () => {
    jest.useFakeTimers()
    const { regEventFx, regFx, dispatch, subscribeToState } = createStore()

    subscribeToState(db => {
    })

    let order = []

    regFx('asyncEffect', (env) => {
      setTimeout(() => { env.fx.dispatch(env, ['fromAsync', 'async']) }, 5)
    })

    regFx('syncEffect1', (env) => { env.fx.dispatch(env, ['from1', 'sync']) })

    regFx('fromDispatched1', () => { order.push('fromDispatched1') })

    regFx('syncEffect2', (env) => { env.fx.dispatch(env, ['from2', 'sync']) })

    regEventFx('from1', () => {
      order.push('from1')
      return [['fromDispatched1']]
    })

    regEventFx('from2', () => {
      order.push('from2')
      return []
    })

    regEventFx('fromAsync', () => {
      order.push('fromAsync')
      return []
    })

    regEventFx('first', () => {
      return [
        ['asyncEffect'],
        ['syncEffect1'],
        ['syncEffect2']
      ]
    })

    regEventFx('done', ({ db }, msg) => {
      console.log('msg', msg)
      return []
    })
    dispatch('first')

    jest.runTimersToTime(1000)
    expect(order).toEqual(['from1', 'fromDispatched1', 'from2', 'fromAsync'])
    jest.resetAllMocks()
  })
})

describe('event stream', () => {
  it('should publish each event name and payload', () => {
    let evts = []
    const { dispatch } = createStore({
      state: { db: {} },
      eventListeners: [(env, event) => {
        evts.push(event)
      }],
      eventFx: {
        'my-evt': [() => [['dispatch', ['my-evt2', 'a', 'b']]]],
        'my-evt2': [() => {}]
      }
    })
    dispatch('my-evt')

    expect(evts.length).toEqual(2)
    expect(evts[0]).toEqual(['my-evt'])
    expect(evts[1]).toEqual(['my-evt2', 'a', 'b'])
  })
})

describe('one-time time fx', () => {
  it('should work', () => {
    jest.useFakeTimers()

    const userCredentials = { id: 123, username: 'mullet-man' }
    const ls = () => {
      let data = { user: JSON.stringify(userCredentials) }
      return {
        getItem: (k) => data[k],
        setItem: (k, v) => data[k] = v,
        removeItem: (k) => delete data[k]
      }
    }

    const deserializeLSUser = userStr => {
      if (!userStr) return null
      const user = JSON.parse(userStr)
      return updateIn(['username'], x => x.toUpperCase(), user)
    }
    const lsKey = k => ls => ls.getItem(k)
    const getUserStr = lsKey('user')
    const getLocalStorageUser = derive([getUserStr], deserializeLSUser)

    const getUser = R.prop('user')

    const replace = jest.fn()

    const makeAutologoutFn = (env) => () => {
      const { dispatch } = env.fx
      const { localStorage, timers } = env.state
      if (!localStorage.getItem('user')) {
        dispatch(env, ['force-log-out'])
        const id = timers['autoLogout'].id
        expect(typeof id === 'number').toEqual(true)
        clearInterval(id)
      }
    }

    const autoLogout = (env) => {
      const { state: { timers } } = env
      const fn = jest.fn(makeAutologoutFn(env))
      timers.autoLogout = { id: setInterval(fn, 1000 / 60), fn }
    }

    const { env, setState } = createStore({
      state: { db: {}, localStorage: ls(), timers: {} },
      fx: { replace, autoLogout },
      eventFx: { 'force-log-out': [() => [['db', R.dissoc('user')], ['replace', ['/']]]] }
    })
    const logOut = ({ state }) => {
      if (getUser(state.db) && !getLocalStorageUser(state.localStorage)) {
        throw new Error(
          'localStorage and db state are out of sync, which may be intentional. '
          + 'User may have been logged out by another tab, but is logged in here until next page refresh.'
        )
      }
      state.localStorage.removeItem('user')
      setState(R.dissoc('user'))
    }

    env.fx.autoLogout(env)
    const ticksBeforeLogout = 42
    setTimeout(() => logOut(env), 1000 / 60 * ticksBeforeLogout)

    jest.runTimersToTime(1000)
    expect(env.state.timers.autoLogout.fn).toHaveBeenCalledTimes(ticksBeforeLogout + 1)
    expect(replace).toHaveBeenCalledTimes(1)
  })
})
