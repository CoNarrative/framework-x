import * as R from 'ramda'
import { createStore } from './createStore'
import { derive } from './util'

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
          try {
            // expect(db.messages).toEqual(reductions(n))
          } catch (e){
            console.log('e',e)
          }
        }
        console.log('okkkkkkkkk', n)
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

describe('event stream', () => {
  it('should publish each event name and payload', () => {
    let evts = []
    const { dispatch } = createStore({
      state: { db: {} },
      eventListeners: [(...x) => evts.push(x)],
      eventFx: {
        'my-evt': [() => [['dispatch', ['my-evt2', 'a', 'b']]]],
        'my-evt2': [() => {}]
      }

    })
    dispatch('my-evt')

    expect(evts.length).toEqual(3)

    const devtoolsEvent = evts[0]
    expect(devtoolsEvent[0]).toEqual({})
    expect(Object.keys(devtoolsEvent[1])).toEqual(['setState', 'subs', 'state'])
    expect(devtoolsEvent[2]).toEqual({})

    expect(evts[1]).toEqual(['my-evt', []])
    expect(evts[2]).toEqual(['my-evt2', ['a', 'b']])
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
    // I feel like we incur more mental burden with "always on" effects than we'd like at this stage
    // It can be mysterious why they happen, because they just sort of ...happen.
    //
    // We can reduce what's going on in this case:
    // A particular effect (dispatch force-log-out) obtains when a predicate (.getItem user === falsy)
    // is true for a particular stateful thing (localStorage)
    // the function runs 60 times per second
    // the function produces an effect at most once: when the predicate obtains, the rule is no longer applicable
    //
    // In the general case:
    // a particular effect or set of effects can result
    // a particular predicate function may gate the result
    // particular stateful things may be affected
    // the function runs every X ms
    // its effects may happen 0 or more times as the result of some state
    // the function may be destroyed as a result of some state
    //
    // dispatching an event helps provide more information since we have better tracking of events than raw effects
    // the dispatched event or another could contain information about why the event was dispatched
    // but would need to be encoded case-by-case
  })
})
describe('preEventFx', () => {
  it('should work!', () => {
    const userCredentials = { id: 123, username: 'mullet-man' }

    const ls = () => {
      let data = { user: JSON.stringify(userCredentials) }
      return {
        getItem: (k) => data[k],
        setItem: (k, v) => data[k] = v,
        removeItem: (k) => delete data[k]
      }
    }

    const localStorage = ls()

    const { env, regPreEventFx, regEventFx, regFx, dispatch } =
      createStore({ state: { db: {}, localStorage } })

    const deserializeLSUser = jest.fn(userStr => {
      if (!userStr) return null
      const user = JSON.parse(userStr)
      return updateIn(['username'], x => x.toUpperCase(), user)
    })

    // can we have derivations off of data that are memoized?
    // const deserializeLocalStorageUser = R.memoizeWith(R.identity, deserializeLSUser)

    // instead of something like this, wa can read directly from the reactive/stateful/ref thing
    // and use a derive pattern for the value that was read
    // const getLocalStorageUser = ls => {
    //   const userStr = ls.getItem('user')
    //   if (userStr) {
    //     return deserializeLocalStorageUser(userStr)
    //   }
    // }

    const lsKey = k => ls => ls.getItem(k)
    const getUserStr = lsKey('user')
    const getLocalStorageUser = derive([getUserStr], deserializeLSUser)

    const getUser = R.prop('user')

    const logOut = ({ state }) => {
      if (getUser(state.db) && !getLocalStorageUser(state.localStorage)) {
        throw new Error(
          'localStorage and db state are out of sync, which may be intentional. '
          + 'User may have been logged out by another tab, but is logged in here until next page refresh.'
        )
      }
      state.localStorage.removeItem('user')
      // setState(R.dissoc('user'))
    }

    // affects local storage
    // could affect other things
    const logIn = ({ state }, user) => {
      state.localStorage.setItem('user', JSON.stringify(user))
      // setState(R.assoc('user', user))
    }

    let redirects = 0
    const redirect = () => {
      redirects += 1
    }
    regFx('redirect', redirect)

    regPreEventFx('user', ({ state: { db, localStorage } }) => {

      return getLocalStorageUser(localStorage)

      // const user = getUser(db)
      // if (user) return user
      // const lsUser = getLocalStorageUser(localStorage)
      // if (lsUser) {
      //   // writing side effects seems confusing / unexpected here
      //   // we just want to supply a value based on a state that exists
      //   //
      //   // setState(R.assoc('user', lsUser))
      //   return lsUser
      // }
    })

    regEventFx('route/protected-page', ({ user }) => {
      if (!user) return [['redirect', ['/']]]
    })

    dispatch('route/protected-page')
    expect(redirects).toEqual(0)

    // simulate other tab/process mutating the shared storage / logging out
    localStorage.removeItem('user')
    dispatch('route/protected-page')
    getLocalStorageUser(env.state.localStorage)
    getLocalStorageUser(env.state.localStorage)
    expect(deserializeLSUser).toHaveBeenCalledTimes(1)

    expect(() => logOut(env)).not.toThrow()

    logIn(env, R.assoc('username', 'fred', userCredentials))

    // derive needs called with a new reference
    expect(getLocalStorageUser(Object.assign({}, env.state.localStorage)).username)
      .toEqual('FRED')
    expect(deserializeLSUser).toHaveBeenCalledTimes(2)
  })
})
