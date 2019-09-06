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
describe('preFx', () => {
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

    const { env, regPreFx,  regEventFx, regFx, dispatch } =
      createStore({ state: { db: {}, localStorage } } )

    const deserializeLSUser = jest.fn(userStr => {
      if (!userStr)  return null
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

    regPreFx('user', ({ state: { db, localStorage } }) => {

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

    expect(()=>logOut(env)).not.toThrow()

    logIn(env,R.assoc('username','fred',userCredentials))

    // derive needs called with a new reference
    expect(getLocalStorageUser(Object.assign({},env.state.localStorage)).username).toEqual('FRED')
    expect(deserializeLSUser).toHaveBeenCalledTimes(2)
  })
})
