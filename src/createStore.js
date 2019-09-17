import { path, prepend, append, mergeDeepRight, chain, identity } from 'ramda'
import * as R from 'ramda'
import { derive } from './util'

const checkType = (op, type) => {
  if (typeof (type) !== 'string') throw new Error(`${op} requires a string as the fx key`)
  if (type.length === 0) throw new Error(`${op} fx key cannot be a zero-length string`)
}

export const regFx = (env, type, fn) => {
  env.fx[type] = fn
}

export const regEventFx = (env, type, fn) => {
  env.eventFx[type] = [...env.eventFx[type] || [], fn]
}

export const regReduceFx = (env, type, fn) => {
  env.reduceFx[type] = fn
}

/**
 * Evaluates an effect definition with the handler defined in the provided environment.
 * May perform computation that alters the environment. Returns the result of the effect handler.
 * @param env
 * @param fxName
 * @param args
 * @returns {*}
 */
export const evalFx = (env, [fxName, args]) => {
  const effect = env.fx[fxName]
  if (!effect) {
    throw new Error(`No fx handler for effect "${fxName}". Try registering a handler using "regFx('${fxName}', ({ effect }) => ({...some side-effect})"`)
  }
  try {
    return effect(env, args)
  } catch (e) {
    console.error(e)
  }
}


/**
 * Returns a list of effect definitions called with f
 * with the result of calling f on the effect definitions or the effect definition
 * unchanged if the result is null or undefined
 * @param env
 * @param f
 * @param effects
 * @returns {*}
 */
const applyFx = (env, f, effects) => {
  return effects.reduce((a, effect) => {
    const ret = f(env, effect)
    a.push(ret != null ? ret : effect)
    return a
  }, [])
}

/**
 * Applies `f` to `env` from an accumulator.
 * Drains accumulator's 'queue' drains and expands 'stack' as effects are applied.
 * @param env
 * @param f
 * @param acc
 */
const applyFxImpure = (env, f, acc) => {
  const len = acc.queue.length
  const q = Object.assign({}, acc.queue)
  for (let i = 0; i < len; i++) {
    const effect = q[i]
    f(env, effect)
    acc.stack.push(effect)
    acc.queue.shift()
  }
}

/**
 * Assigns 'state.db' of `x` to the result of calling `newStateOrReducer` with 'state.db' of `x`
 * or to newStateOrReducer if not a function
 * @param x
 * @param newStateOrReducer
 */
const setDb = (x, newStateOrReducer) => {
  if (typeof newStateOrReducer !== 'function') {
    x.state.db = newStateOrReducer
  } else {
    x.state.db = newStateOrReducer(x.state.db)
    if (typeof x.state.db === 'function') {
      throw new Error('db fxReg request was a reducer function that returned a function. '
                      + 'If you are using ramda, you probably didn\'t finish currying all the args')
    }
  }
}

/**
 * Creates a new accumulator object suitable for usage with
 * @param env
 * @returns {{stack: Array, reductions: Array, state: any, queue: Array}}
 */
const createAccum = env => ({
  state: Object.assign({}, env.state),
  reductions: [],
  stack: [],
  queue: [],
})

/**
 * Evaluates event handlers in `env` for `event` with recursive handling of events resulting from an event handler's `dispatch` effect.
 * Applies any `reduceFx` returned by event handlers to 'state', in `acc`.
 * Adds fx descriptions from event handlers to 'queue' in `acc`.
 * @param env
 * @param acc
 * @param event
 */
const reduceEventEffects = (env, acc, event) => {
  acc.queue.push(['notifyEventListeners', event])
  const [type, args] = event
  const eventHandlers = env.eventFx[type]
  if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)

  eventHandlers.forEach((handler) => {
    const effects = handler({ ...acc.state }, args)
    if (!effects) {
      return
    }
    const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)

    return effectsList.forEach((effect) => {
      const [k, v] = effect
      let rfx = env.reduceFx[k]
      if (rfx) {
        const ret = rfx(env, acc, v)
        acc.reductions.push(effect, ret)
      } else if (k !== 'dispatch') {
        acc.queue.push(effect)
      } else {
        return reduceEventEffects(env, acc, v)
      }
    })
  })
}

export const dispatchFx = (env, event) => {
  const finalEvent = Array.isArray(event[0]) ? event[0] : event
  if (!finalEvent[0]) throw new Error('Dispatch requires a valid event key')

  let acc = createAccum(env)

  try {
    reduceEventEffects(env, acc, finalEvent)

    acc.queue.unshift(['setDb', acc.state.db], ['notifyStateListeners'])

    env.fx.applyImpure(env, env.fx.eval, acc)

  } catch (e) {
    if (Object.keys(env.errorFx).length > 0) {
      env.errorFx['dispatch-error'](env, acc, e)
    }
  }
}

export const identityEnv = () => ({
  state: { db: {} },
  reduceFx: {
    db: ({ fx }, acc, newStateOrReducer) => {
      fx.setDb(acc, newStateOrReducer)
      return Object.assign({}, acc.state)
    },
  },
  fx: {
    apply: applyFx,
    applyImpure: applyFxImpure,
    setDb,
    eval: evalFx,
    notifyStateListeners: derive([path(['dbListeners']), path(['state', 'db'])],
      (a, b) => a.forEach(f => f(b))),
    notifyEventListeners: (env, event) => env.eventListeners.forEach(f => f(event)),
    dispatch: dispatchFx,
  },
  errorFx: {
    'dispatch-error': (env, acc, e) => {
      acc.queue.shift()
      env.fx.applyImpure(env, env.fx.eval, acc)
    },
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
    },
  }, {}))

  return {
    env,
    dispatch: (event, args) => { env.fx.dispatch(env, args ? [event, args] : [event]) },
    getState: () => env.state.db,
    setState: (newStateOrReducer, notify = true) => {
      env.fx.apply(env, env.fx.eval, [
        ['setDb', newStateOrReducer],
      ].concat(notify ? [['notifyStateListeners']] : []))
    }, // for when you want to bypass the eventing
    regEventFx: (type, fn) => {
      checkType('regEventFx', type)
      env.eventFx[type] = [...env.eventFx[type] || [], fn]
    },
    regFx: (type, fn) => {
      checkType('regFx', type)
      env.fx[type] = fn
    },
    regReduceFx: (type, fn) => {
      checkType('regReduceFx', type)
      env.reduceFx[type] = fn
    },
    subscribeToState: fn => env.dbListeners.push(fn),
  }
}
