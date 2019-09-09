// import hoistStatics from 'hoist-non-react-statics'
// import mergeDeepRight from 'ramda/es/mergeDeepRight'
import { concat, append, mergeDeepRight } from 'ramda'


export const regFxRaw = (env, type, fn) => {
  env.fx[type] = fn
}

export const regEventFxRaw = (env, type, fn) => {
  env.eventFx[type] = [...env.eventFx[type] || [], fn]
}

export const regPreEventFxRaw = (env, type, fn) => {
  env.preEventFx[type] = fn
}

export const processEffects = (env, effects) => {
  effects.forEach(([key, value]) => {
    const effect = env.fx[key]
    if (!effect) throw new Error(`No fx handler for effect "${key}". Try registering a handler using "regFx('${key}', ({ effect }) => ({...some side-effect})"`)
    // NOTE: no need really to handle result of effect for now -
    effect(env, value)
  })
}

//

const parseEventEffects = (env, event) => {
  const type = event[0]
  const args = event.slice(1)
  // env.eventListeners.forEach(f => f(type, args))
  /* reframe only allows one handler I learned -- but I like extending event handlers elsewhere so multiple it is */
  const eventHandlers = env.eventFx[type]
  if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)

  const preEventFx = Object.entries(env.preEventFx).reduce((a, [k, f]) => {
    a[k] = f(env)
    return a
  }, { eventName: type })

  return eventHandlers.reduce((a1, handler) => {
    const effects = handler({ ...env.state, ...preEventFx }, ...args)
    if (!effects) return a1

    const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)
    return append(effectsList.reduce((a, [k, v]) =>
        k !== 'dispatch'
        ? append([k, v], a)
        : concat(parseEventEffects(env, v), a),
      []), a1)
    //  :(
    //  return append({
    //    [type]: effectsList.reduce((a, [k, v]) =>
    //      k !== 'dispatch'
    //      ? append([k, v], a)
    //      : append(parseEventEffects(env, v), a1),
    //      [])
    //  },a1)
  }, [])
}
export const processEventEffects = (env, event) => {
  const type = event[0]
  const args = event.slice(1)
  env.eventListeners.forEach(f => f(type, args))
  /* reframe only allows one handler I learned -- but I like extending event handlers elsewhere so multiple it is */
  const eventHandlers = env.eventFx[type]
  if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)

  const preEventFx = Object.entries(env.preEventFx).reduce((a, [k, f]) => {
    a[k] = f(env)
    return a
  }, { eventName: type })

  eventHandlers.forEach(handler => {
    const effects = handler({ ...env.state, ...preEventFx }, ...args)
    if (!effects) return
    const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)
    processEffects(env, effectsList)
  })
}

const checkType = (op, type) => {
  if (typeof (type) !== 'string') throw new Error(`${op} requires a string as the fx key`)
  if (type.length === 0) throw new Error(`${op} fx key cannot be a zero-length string`)
}

export const identityEnv = () => ({
  state: { db: {}, dispatch: { depth: 0 } },
  preEventFx: {},
  fx: {
    db: (env, newStateOrReducer) => {
      if (typeof newStateOrReducer !== 'function') {
        env.state.db = newStateOrReducer
      } else {
        env.state.db = newStateOrReducer(env.state.db)
        if (typeof env.state.db === 'function') {
          throw new Error('db fxReg request was a reducer function that returned a function. '
                          + 'If you are using ramda, you probably didn\'t finish currying all the args')
        }
      }
    },
    dispatch: (env, event) => {
      const finalEvent = Array.isArray(event[0]) ? event[0] : event
      if (!finalEvent[0]) throw new Error('Dispatch requires a valid event key')

      let startState
      if (env.state.dispatch.depth === 0) {
        startState = env.state.db
      }

      try {
        env.state.dispatch.depth += 1
        const effects = parseEventEffects(env, finalEvent)
        console.log('fx', JSON.stringify(effects, null, 2))
        // processEventEffects(env, finalEvent)
      } finally {
        // always make sure it decrements back even if fx throws error
        env.state.dispatch.depth -= 1
      }

      if (env.state.dispatch.depth === 0 && startState !== env.state.db) {
        env.dbListeners.forEach(fn => fn(env.state.db))
      }
    }
  },
  events: {},
  eventFx: {},
  dbListeners: [],
  eventListeners: [],
})

export const createStore = (args = identityEnv()) => {
  const env = mergeDeepRight(identityEnv(), args)

  /* Hacked a bit to support redux devtools  */
  env.eventListeners.forEach(m => m({}, {
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

  return {
    env,
    dispatch: (...event) => { env.fx.dispatch(env, event) },
    getState: () => env.state.db,
    setState: (newStateOrReducer) => env.fx.db(env, newStateOrReducer), // for when you want to bypass the eventing
    regEventFx: (type, fn) => {
      checkType('regEventFx', type)
      env.eventFx[type] = [...env.eventFx[type] || [], fn]
    },
    regFx: (type, fn) => {
      checkType('regFx', type)
      env.fx[type] = fn
    },
    regPreEventFx: (type, fn) => {
      checkType('regPreEventFx', type)
      env.preEventFx[type] = fn
    },
    subscribeToState: fn => env.dbListeners.push(fn)
  }
}
