import * as R from 'ramda'
import { createStore, createAccum, reduceEventEffects } from 'framework-x'
import { evt } from './eventTypes'
import { localStorageFx } from './fx'
import { initDb } from './generalEvents'

const createLocalStorage = (data) => {
  let m = Object.assign({}, data)
  return {
    getItem: (k) => m[k],
    setItem: (k, v) => m[k] = v,
    removeItem: (k) => delete m[k]
  }
}
const GOOD_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6NjQzODgsInVzZXJuYW1lIjoiKioiLCJleHAiOjE1NzQzODc0OTF9.h-ADvhZCou4sIAQbQ03XFLaYitwqJDDbTDDKTtKSHDQ'
const BAD_TOKEN = 'abc'
describe('init', () => {
  it('should set db with user from local storage when token exists', () => {
    const { env, setState, regFx } = createStore({
      eventFx: {
        [evt.INITIALIZE_DB]: [initDb]
      }
    })

    regFx('localStorage', localStorageFx({
      setState,
      localStorage: createLocalStorage({ jwt: GOOD_TOKEN })
    }))

    let acc = createAccum(env)
    reduceEventEffects(env, acc, [evt.INITIALIZE_DB, { articles: [] }])
    expect(acc.reductions.length).toEqual(1)
    expect(acc.state).toEqual({ db: { articles: [] } })
    expect(env.state).toEqual({ db: {} })
    expect(R.map(R.head, acc.stack)).toEqual(['db'])
    expect(R.map(R.head, acc.queue)).toEqual(['notifyEventListeners', 'localStorage'])

    const applied = env.fx.apply(env, env.fx.eval, acc.queue)
    expect(R.map(R.head, applied)).toEqual(['notifyEventListeners', 'localStorage'])
    expect(Object.keys(env.state.db)).toEqual(['user', 'token'])
  })

  it('should dispatch error on malformed jwt but still set initial state', () => {
    const jwtErrorFx = jest.fn()

    const { env, dispatch, setState, regFx } = createStore({
      eventFx: {
        [evt.INITIALIZE_DB]: [initDb]
      },
      errorFx: {
        jwt: jwtErrorFx
      }
    })

    regFx('localStorage', localStorageFx({
      setState,
      localStorage: createLocalStorage({ jwt: BAD_TOKEN })
    }))

    dispatch(evt.INITIALIZE_DB, { articles: [] })

    expect(jwtErrorFx).toHaveBeenCalled()
    expect(env.state.db).toEqual({ articles: [] })
  })
})
