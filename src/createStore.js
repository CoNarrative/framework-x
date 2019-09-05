// import hoistStatics from 'hoist-non-react-statics'
import {mergeDeepRight} from 'ramda'

const shallowClone = a => Array.isArray(a) ? a.concat([]) : Object.assign({}, a)

export const identityEnv = () => ({
  state: { db: {}, dispatchDepth: 0, stateIsDirty: false },
  valueProviders: {
    db: ({ db }) => db
  },
  fx: {
    db: (env, newStateOrReducer) => {
      if (typeof newStateOrReducer !== 'function') {
        env.state.db = newStateOrReducer
      } else {
        env.state.db = newStateOrReducer(env.state.db)
        if (typeof env.state.db === 'function') {
          throw new Error('db fxReg request was a reducer function that returned a function. ' + 'If you are using ramda, you probably didn\'t finish currying all the args')
        }
      }
    }
  },
  eventFx: {},
  dbListeners: [],
  eventListeners: [],
})

export const createStore = (args = identityEnv()) => {
  const env = mergeDeepRight(identityEnv(), args)

  /* Hacked a bit to support redux devtools -- the only middleware we care about right now */
  let initializedEventListeners = env.eventListeners.map(m => m({}, {
    setState(state) {
      env.fx.db(env, state)
    },
    get subs() {
      return []
    },
    get state() {
      return env.state.db
    }
  }, {}))

  const checkType = (op, type) => {
    if (typeof (type) !== 'string') throw new Error(`${op} requires a string as the fx key`)
    if (type.length === 0) throw new Error(`${op} fx key cannot be a zero-length string`)
  }
  const regEventFx = (type, fn) => {
    checkType('regEventFx', type)
    env.eventFx[type] = [...env.eventFx[type] || [], fn]
  }

  const regFx = (type, fn) => {
    checkType('regEventFx', type)
    env.fx[type] = fn
  }

  const notifyEventListeners = (type, payload, effects,
    count) => initializedEventListeners.forEach(m => m(type, payload, effects, count))

  /**
   * synchronous dispatch
   * @param event
   */
  const processEventEffects = (env,event) => {
    const type = event[0]
    const args = event.slice(1)
    // console.log('H:', type, args)
    /* reframe only allows one handler I learned -- but I like extending event handlers elsewhere so multiple it is */
    const eventHandlers = env.eventFx[type]
    if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)
    let count = 0
    eventHandlers.forEach(handler => {
      const coeffects = Object.entries(env.valueProviders).reduce((a, [k, f]) => {
        a[k] = f(env.state)
        return a
      }, {})
      const effects = handler(coeffects, ...args)
      if (!effects) return
      const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)
      /* Process effects */
      effectsList.forEach(([key, value]) => {
        const effect = env.fx[key]
        // console.log(`  effect handler (${key}) for event (${type})`, value)
        if (!effect) throw new Error(`No fx handler for effect "${key}". Try registering a handler using "regFx('${key}', ({ effect }) => ({...some side-effect})"`)
        // NOTE: no need really to handle result of effect for now -
        effect(env, value)
        if (key === 'db') {
          env.state.stateIsDirty = true
        }
      })

      notifyEventListeners(type, args, effects, count)
      count++
    })
  }

  /* dispatch fxReg should happen next tick */
  const dispatch = (env, event) => {
    const finalEvent = Array.isArray(event[0]) ? event[0] : event
    if (!finalEvent[0]) throw new Error('Dispatch requires a valid event key')

    env.state.dispatchDepth += 1
    processEventEffects(env, finalEvent)
    env.state.dispatchDepth -= 1

    if (env.state.dispatchDepth === 0 && env.state.stateIsDirty) {
      env.dbListeners.forEach(fn => fn(env.state.db))
      env.state.stateIsDirty = false
    }
  }
  regFx('dispatch', dispatch)

  const subscribeToState = fn => env.dbListeners.push(fn)

  return {
    env,
    dispatch: (...event) => { dispatch(env, event) },
    getState: () => env.state.db,
    setState: (newStateOrReducer)=>env.fx.db(env,newStateOrReducer), // for when you want to bypass the eventing
    regEventFx,
    regFx,
    subscribeToState
  }
}
