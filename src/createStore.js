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
    a.push(ret == null ? ret : effect)
    return a
  }, [])
}

const applyFxImpure = (env, f) => {
  console.log('applying  impure',env.acc.queue)
  const len = env.acc.queue.length
  const q = Object.assign({}, env.acc.queue)
  for (let i = 0; i < len; i++) {
    const effect = q[i]
    f(env, effect)
    env.acc.stack.push(effect)
    env.acc.queue.shift()
  }
}

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

const createAccum = env => ({
  state: Object.assign({}, env.state),
  reductions: [],
  stack: [],
  queue: []
})

const assignAccum = env => {
  env.acc = createAccum(env)
  return env
}

const reduceEventEffectsImpure = (env, event) => {
  env.acc.queue.push(['notifyEventListeners', event])
  const [type, args] = event
  const eventHandlers = env.eventFx[type]
  if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)

  eventHandlers.forEach((handler) => {
    const effects = handler({ ...env.acc.state }, args)
    if (!effects) {
      return
    }
    const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)

    return effectsList.forEach((effect) => {
      const [k, v] = effect
      let rfx = env.reduceFx[k]
      if (rfx) {
        const ret = rfx(env, v)
        env.acc.reductions.push(effect, ret)
      } else if (k !== 'dispatch') {
        env.acc.queue.push(effect)
      } else {
        return reduceEventEffectsImpure(env, v)
      }
    })
  })
}

const reduceEventEffects = (env, event) => {
  const [type, args] = event
  /* reframe only allows one handler I learned -- but I like extending event handlers elsewhere so multiple it is */
  const eventHandlers = env.eventFx[type]
  if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)

  return eventHandlers.reduce((hr, handler) => {
    const effects = handler({ ...env.acc.state }, args)
    if (!effects) {
      return prepend([['notifyEventListeners', event]], hr)
    }

    const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)

    return append(
      prepend(['notifyEventListeners', event], effectsList)
        .reduce((eventEffects, [k, v]) => {
          let rfx = env.reduceFx[k]
          if (rfx) {
            const ret = rfx(env, v)
            return append([k, v], eventEffects)
          } else if (k !== 'dispatch') {
            return append([k, v], eventEffects)
          } else {
            return [...eventEffects.concat(...reduceEventEffects(env, v))]
          }
        }, []), hr)
  }, [])
}

export const identityEnv = () => ({
  state: { db: {} },
  reduceFx: {
    db: ({ fx, acc }, newStateOrReducer) => {
      fx.setDb(acc, newStateOrReducer)
      return Object.assign({}, acc.state)
    }
  },
  // effects capable of being expressed as data
  // and executed as a function of their arguments
  fx: {
    apply: applyFx,
    applyImpure: applyFxImpure,
    setDb,
    eval: evalFx,
    notifyStateListeners: derive([path(['dbListeners']), path(['state', 'db'])],
      (a, b) => a.forEach(f => f(b))),
    notifyEventListeners: (env, event) => env.eventListeners.forEach(f => f(event)),
    dispatch: (env, event) => {
      const finalEvent = Array.isArray(event[0]) ? event[0] : event
      if (!finalEvent[0]) throw new Error('Dispatch requires a valid event key')

      try {
        reduceEventEffectsImpure(assignAccum(env), finalEvent)

        env.acc.queue.unshift(['setDb', env.acc.state.db], ['notifyStateListeners'], ['fooey'])

        env.fx.applyImpure(env, env.fx.eval)

        delete env.acc

      } catch (e) {
        env.errorFx['dispatch-error'](env, e)
      }
    }
  },
  errorFx: {
    'dispatch-error': (env, e) => {
      // console.log('did this', env.acc.stack,)
      // console.log('next up', env.acc.queue,)
      // console.log('reductions so far', env.acc.reductions)
      // console.log('reduced as state', env.acc.state)
      // console.log('state is', env.state)
      env.acc.queue.shift()
      console.log('queue is', env.acc.queue)
      env.fx.applyImpure(env,env.fx.eval)
      // console.error('got error', env, e)
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
    dispatch: (event, args) => { env.fx.dispatch(env, args ? [event, args] : [event]) },
    getState: () => env.state.db,
    setState: (newStateOrReducer, notify = true) => {
      env.fx.apply(
        env,
        env.fx.eval, [
          ['setDb', newStateOrReducer],
        ].concat(notify ? [['notifyStateListeners']] : []))
      // setDb(env, newStateOrReducer)
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
    subscribeToState: fn => env.dbListeners.push(fn)
  }
}
