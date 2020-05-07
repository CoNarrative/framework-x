import {
  DefaultEnv,
  IEnv,
  EffectTuple,
  NewStateOrReducer,
  MapValue,
  Accum,
  AnyKV,
  EffectDescription,
  LooseEffectDescription,
  DispatchEnv,
  EnvWith,
  EventVector,
  ErrorEffect,
} from "./types"
import { FxError } from "./FxError"


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

export const regErrorFx = (env, type, fn) => {
  env.errorFx[type] = fn
}

/**
 * Evaluates an effect definition using the handler defined in the provided environment.
 * May perform computation that alters the environment. Returns the result of the effect handler.
 * @param env
 * @param fxName
 * @param args
 * @returns {*}
 */
export const evalFx = <E extends { fx: any }>(
  env: E,
  [fxName, args]: [keyof E['fx'], any]
) => {
  const effect = env.fx[fxName]
  if (!effect) {
    throw new FxError('fx/unhandled', {
      message: `No fx handler for effect "${fxName}". Try registering a handler using "regFx('${fxName}', ({ effect }) => ({...some side-effect})"`,
      suggestions: [{
        code:
          `regFx('${fxName}', (env, args) => {\n` +
          `\n` +
          `})`
      }]
    })
  }
  return effect(env, args)
}

/**
 * Returns a list of effect definitions called with f
 * with the result of calling f on the effect definitions or the effect definition
 * unchanged if the result is null or undefined.
 * @param env
 * @param f
 * @param effects
 * @returns {*}
 */
export const applyFx = <E extends { fx: any }>(
  env: E,
  f: (env: E,
      effect: EffectTuple<E['fx']>) => any,
  effects: Array<EffectTuple<E['fx']>>): any => {
  return effects.reduce((a: any[], effect: any) => {
    const ret = f(env, effect)
    a.push(ret != null ? ret : effect)
    return a
  }, [])
}

/**
 * Applies `f` to effects in `acc.queue`, mutating its `queue` and `stack` as effects are applied with `f`.
 * @param env
 * @param f
 * @param acc
 */
export const applyFxImpure = <E>(
  env: E,
  f: (env: E, effect: LooseEffectDescription) => any,
  acc: Accum<E>
) => {
  const len = acc.queue.length
  const q = Object.assign({}, acc.queue)
  for (let i = 0; i < len; i++) {
    const effect = q[i]
    f(env, effect)
    acc.stack.push(effect as EffectTuple<E>)
    acc.queue.shift()
  }
}

export const setDb = <E extends { state: { db: any } }>(x: E, newStateOrReducer: NewStateOrReducer<E>) => {
  if (typeof newStateOrReducer !== 'function') {
    x.state.db = newStateOrReducer
  } else {
    x.state.db = newStateOrReducer(x.state.db)
    if (typeof x.state.db === 'function') {
      throw new FxError('fx.db/arguments', {
        message: 'db fxReg request was a reducer function that returned a function. '
          + 'If you are using ramda, you probably didn\'t finish currying all the args',
        expected: '[env, db => db]',
        received: '[env, db => db => x]'
      })
    }
  }
}

/**
 * Returns a new accumulator suitable for use with `reduceEventEffects`.
 * @param env
 */
export const createAccum = <E extends AnyKV & { state: any }>(env: E): Accum<E> => ({
  state: Object.assign({}, env.state),
  reductions: [],
  stack: [],
  queue: [],
  events: []
})

/**
 * Reduces an event's effects recursively, modifying the provided accumulator with the results of the execution.
 * ReduceFx are called with `acc.state` and pushed to `acc.stack`.
 * All other effects are queued to `acc.queue`.
 * @param env
 * @param acc
 * @param event
 */
export const reduceEventEffects = <E extends Required<EnvWith<'state' | 'eventFx' | 'reduceFx'>> & { events?: any }>(
  env: E,
  acc: Accum<E>,
  event: EventVector<E>
) => {
  acc.events.push(event)
  acc.queue.push(['notifyEventListeners', event])
  const [type, args] = event
  const eventHandlers = env.eventFx[type]
  if (!eventHandlers) throw new FxError('event-fx/unhandled', {
    message: `No event fx handler for dispatched event "${type}"`,
    suggestions: [{
      code:
        `regEventFx('${event[0]}', ({ db }, args) => {\n` +
        `  return []\n` +
        `})`
    }]
  })

  eventHandlers.forEach((handler) => {
    const effects = handler({ ...acc.state }, args)
    if (!effects) {
      return
    }
    const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)

    effectsList.forEach((effect) => {
      const [k, v] = effect
      let rfx = env.reduceFx[k]
      if (rfx) {
        const ret = rfx(env, acc, v)
        acc.stack.push(effect)
        acc.reductions.push(ret)
      } else if (k !== 'dispatch') {
        acc.queue.push(effect)
      } else {
        return reduceEventEffects(env, acc, v as EventVector<E>)
      }
    })
  })
}

/**
 * Called when an event is dispatched. Obtains a reduction from eventFx for the supplied event.
 * Prepends setDb and notifyStateListeners to the resulting side-effects list.
 * Catches all exceptions during eventFx and fx evaluation. Recoverable exceptions are forwarded to their registered
 * errorFx handlers or logged.
 * @param env
 * @param event
 */
export const dispatchFx = <E extends DispatchEnv<E>>(
  env: E,
  event: EventVector<E>
) => {

  let acc = createAccum(env)

  try {
    if (!Array.isArray(event)) {
      acc.events.push(event)
      throw new FxError(
        'fx.dispatch/arguments', {
          message: 'fx.dispatch called with wrong arguments.',
          expected: '[env, [eventName, payload?]]',
          received: [env, event]
        })
    }
    reduceEventEffects(env, acc, event)

    acc.queue.unshift(['setDb', acc.state.db], ['notifyStateListeners'])

    env.fx.applyImpure(env, env.fx.eval, acc)

  } catch (e) {
    env.fx.handleError(env, acc, e)
  }
}


/**
 * Root error effect handler. Delegates to `errorFx` registered in the provided environment.
 * Error is logged if no errorFx are registered.
 * @param env
 * @param acc
 * @param e
 */
export const rootErrorFx = <E>(env: E & { errorFx?: ErrorEffect<E> }, acc: Accum<E>, e: Error) => {
  if ((e as any).isResumable && env.errorFx && env.errorFx[e.name]) {
    env.errorFx[e.name](env, acc, e)
    return
  }
  throw e
}

/**
 * Clears the in-progress execution in `prevAcc` and continues with the one provided.
 * @param env
 * @param prevAcc
 * @param acc
 */
export const resumeFx = <E>(env: E & EnvWith<'fx'>, prevAcc: Accum<any>, acc: Accum<any>) => {
  if (!prevAcc) throw new Error('resumeFx requires the accumulator passed to errorFx')

  // @ts-ignore
  prevAcc = null

  try {
    env.fx.applyImpure(env, env.fx.eval, acc)
  } catch (e) {
    env.fx.handleError(env, acc, e)
  }
}

/**
 * Returns a map of functions with typed effect descriptions suitable for returning from EventFx
 * @param fx
 */
export const createFxDescriptors = <Fx extends { [k: string]: (...args: any) => any }>(fx: Fx) => {
  return Object.entries(fx).reduce((a, [k, _]) => {
    a[k] = (x) => [k, x]
    return a
  }, {}) as { [K in keyof Fx]: (args: Parameters<Fx[K]>[1]) => [ReturnType<Fx[K]>[0], Parameters<Fx[K]>[1]] }
}

export const defaultEnv = (): DefaultEnv => ({
  state: { db: {} },
  reduceFx: {
    db: ({ fx, }, acc: { state: { db: any } }, newStateOrReducer) => {
      fx.setDb(acc, newStateOrReducer)
      return Object.assign({}, acc.state)
    }
  },
  fx: {
    apply: applyFx,
    applyImpure: applyFxImpure,
    setDb,
    eval: evalFx,
    dispatch: dispatchFx,
    resume: resumeFx,
    handleError: rootErrorFx,
    notifyStateListeners: (env) => {
      env.dbListeners.forEach(f => f(env.state.db))
    },
    notifyEventListeners: (env: DefaultEnv, event: [string, any]) =>
      env.eventListeners!.forEach((f: any) => f(env, event)),
  },
  errorFx: {},
  events: {},
  eventFx: {},
  dbListeners: [],
  eventListeners: [],
})

/**
 * Accepts an environment and returns it merged with defaults.
 * Attempts to preserve as much structural type information as possible.
 * @param args
 */
export const mergeEnv = <E>(args?: E extends IEnv ? E : never) => {
  const defaultEnvValue = defaultEnv()
  if (typeof args !== 'undefined') {
    const merged = Object.entries(defaultEnvValue).reduce((a, [k, v]) => {
      if (defaultEnvValue.hasOwnProperty(k) && args.hasOwnProperty(k)) {
        if (Array.isArray(defaultEnvValue[k])) {
          a[k] = args[k]
          return a
        }
        a[k] = Object.assign({}, defaultEnvValue[k], args[k])
        return a
      }
      a[k] = v
      return a
    }, {})
    return merged as E extends IEnv ? ({
      state: Omit<DefaultEnv['state'], keyof typeof args['state']>,
      events: typeof args['events'],
      fx: Omit<DefaultEnv['fx'], keyof typeof args['fx']>,
      reduceFx: Omit<DefaultEnv['reduceFx'], keyof typeof args['reduceFx']>,
      errorFx: Omit<DefaultEnv['errorFx'], keyof typeof args['errorFx']>,
      eventListeners?: any[]
      dbListeners?: any[]
    } & Pick<typeof args, 'state' | 'events' | 'fx' | 'eventFx'>) : never
  } else {
    return defaultEnvValue as E extends IEnv ? never : DefaultEnv
  }
}

type Fn<T,R> = (x:T)=>R
const  makeDefaultFx = <Db>()=> ({
  db: (newStateOrReducer: Db | Fn<Db,Db>) => {
  }
})

export const createStore = <E>(args?: E extends IEnv ? E : never) => {
  const env = mergeEnv(args)

  type Env = typeof env
  type EventName = E extends { events: infer U } ? MapValue<U, keyof U> : string

  return {
    env,
    dispatch: (
      eventName: EventName,
      args?: any
    ) => {
      env.fx.dispatch(env, args ? [eventName, args] : [eventName])
    },
    getState: () => env.state.db,
    setState: (newStateOrReducer: NewStateOrReducer<Env>, notify = true) => {
      env.fx.apply(env, env.fx.eval, [
        ['setDb', newStateOrReducer],
      ].concat(notify ? [['notifyStateListeners']] : []))
    },
    regFx: (
      type: string,
      fn: (env: Env, args: any) => void
    ) => {
      checkType('regFx', type)
      env.fx[type] = fn
    },
    regEventFx: (
      eventName: string,
      fn: (ctx: Env['state'], args: any) => [string, ...any[]][]
        | undefined | []
    ) => {
      checkType('regEventFx', eventName)
      env.eventFx[eventName] = [...env.eventFx[eventName] || [], fn]
    },
    regReduceFx: (
      type: string,
      fn: (env: Env, acc: Accum<Env>, args: any) => Env['state']
    ) => {
      checkType('regReduceFx', type)
      env.reduceFx[type] = fn
    },
    regErrorFx: (
      type: string,
      fn: (env: Env, acc: Accum<Env>, args: any) => Env['state']
    ) => {
      checkType('regErrorFx', type)
      env.errorFx[type] = fn
    },
    subscribeToState: f => env.dbListeners!.push(f)
  }
}
