import { path, prepend, append, mergeDeepRight, chain, identity } from 'ramda'
import * as R from 'ramda'
import { derive } from './util'
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
  EventName,
  DispatchEnv, EnvWith, Store
} from "./index"


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
    throw new Error(`No fx handler for effect "${fxName}". Try registering a handler using "regFx('${fxName}', ({ effect }) => ({...some side-effect})"`)
  }
  return effect(env, args)
}
// evalFx({ fx: { foo: (e: any, a: number) => "" } }, ['foo', 'bar'])


/**
 * Returns a list of effect definitions called with f
 * with the result of calling f on the effect definitions or the effect definition
 * unchanged if the result is null or undefined
 * @param env
 * @param f
 * @param effects
 * @returns {*}
 */
const applyFx = <E extends { fx: any }>(
  env: E,
  f: (env: E,
      effect: EffectTuple<E['fx']>) => any,
  effects: Array<EffectTuple<E['fx']>>): any => {
  return effects.reduce((a: any[], effect: any) => {
    const ret = f(env, effect)
    a.push(ret == null ? ret : effect)
    return a
  }, [])
}

const applyFxImpure = <E>(
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

const setDb = <E extends { state: { db: any } }>(x: E, newStateOrReducer: NewStateOrReducer<E>) => {
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

const createAccum = <E extends AnyKV & { state: any }>(env: E): Accum<E> => ({
  state: Object.assign({}, env.state),
  reductions: [],
  stack: [],
  queue: []
})

type EventVector<E> = [E extends { events: any } ? EventName<E> : string, any]
/**
 * Reduces an event's effects recursively, modifying the provided accumulator with the results of the execution
 * ReduceFx are called with `acc.state` and pushed to `acc.stack`.
 * All other effects are queued to `acc.queue`.
 * @param env
 * @param acc
 * @param event
 */
const reduceEventEffects = <E extends Required<EnvWith<'state' | 'eventFx' | 'reduceFx'>> & { events?: any }>(
  env: E,
  acc: Accum<E>,
  event: EventVector<E>
) => {
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

    effectsList.forEach((effect) => {
      const [k, v] = effect
      let rfx = env.reduceFx[k]
      if (rfx) {
        const ret = rfx(env, acc, v)
        acc.reductions.push(effect, ret)
      } else if (k !== 'dispatch') {
        acc.queue.push(effect)
      } else {
        return reduceEventEffects(env, acc, v as EventVector<E>)
      }
    })
  })
}

const dispatchFx = <E extends DispatchEnv<E>>(
  env: E,
  event
) => {
  const finalEvent = Array.isArray(event[0]) ? event[0] : event
  if (!finalEvent[0]) throw new Error('Dispatch requires a valid event key')
  let acc = createAccum(env)
  try {
    reduceEventEffects(env, acc, finalEvent)

    acc.queue.unshift(['setDb', acc.state.db], ['notifyStateListeners'], ['fooey'])

    env.fx.applyImpure(env, env.fx.eval, acc)

  } catch (e) {
    if (env.errorFx && Object.keys(env.errorFx).length > 0) {
      Object.entries(env.errorFx).forEach(([_, handler]) => {
        handler(env, acc, e)
      })
      return
    }
    console.error(e)
  }
}
/**
 * Returns a map of functions with typed effect descriptions suitable for returning from EventFx
 *
 * @param fx
 */
export const createFxDescriptors = <Fx extends { [k: string]: (...args: any) => any }>(fx: Fx) => {
  return Object.entries(fx).reduce((a, [k, _]) => {
    a[k] = (x) => [k, x]
    return a
  }, {}) as { [K in keyof Fx]: (...args: Parameters<Fx[K]>[1]) => [K, Parameters<Fx[K]>[1]] }
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

    //todo. @types/reselect
    notifyStateListeners: derive([
      path(['dbListeners']), path(['state', 'db'])
      ], (a: any[], b: any) => a.forEach((f: any) => f(b))),

    // todo. only useful when events
    notifyEventListeners: (env: DefaultEnv, event: [string, any]) =>
      env.eventListeners!.forEach((f: any) => f(event)),
    dispatch: dispatchFx
  },
  errorFx: {
    'dispatch-error': (env: DefaultEnv, acc: Accum<DefaultEnv>, e: any) => {
      acc.queue.shift()
      env.fx.applyImpure(env, env.fx.eval, acc.queue)
    }
  },
  // events: {},
  eventFx: {},
  dbListeners: [],
  eventListeners: [],
})
const mergeEnv = <E>(args?: E extends IEnv ? E : never) => {
  const defaultEnvValue = defaultEnv()
  if (typeof args !== 'undefined') {
    const merged = Object.entries(defaultEnvValue).reduce((a, [k, v]) => {

      if (defaultEnvValue.hasOwnProperty(k) && args.hasOwnProperty(k)) {
        a[k] = Object.assign({}, defaultEnvValue[k], args[k])
      }
      a[k] = v
      return a
    }, {})
    return merged as E extends IEnv? ({
      state: Omit<DefaultEnv['state'], keyof typeof args['state']>,
      events: typeof args['events'] extends infer U? U:{},
      fx: Omit<DefaultEnv['fx'], keyof typeof args['fx']>,
      reduceFx: Omit<DefaultEnv['reduceFx'], keyof typeof args['reduceFx']>,
      errorFx: Omit<DefaultEnv['errorFx'], keyof typeof args['errorFx']>,
      eventListeners?: any[]
      dbListeners?: any[]

    } & Pick<typeof args, 'state' | 'events' | 'fx' | 'eventFx'>) : never
  } else {
    return defaultEnvValue as E extends IEnv? never: DefaultEnv
  }
}
export const createStore = <E>(args?: E extends IEnv ? E : never) => {
  const env = mergeEnv(args)

  /* Hacked a bit to support redux devtools  */
  env.eventListeners!.forEach(m => m({}, {
    setState(state: typeof env['state']) {
      env.fx.eval(env, ['setDb', state])
    },
    get subs() {
      return []
    },
    get state() {
      return env.state.db
    }
  }, {}))

  type Env = (typeof args & DefaultEnv)
  return {
    env,
    dispatch: (eventName: string, args?: any) => {
      env.fx.dispatch(env, args ? [eventName, args] : [eventName])
    },
    getState: () => env.state.db,
    setState: (newStateOrReducer: NewStateOrReducer<Env>, notify = true) => {
      env.fx.apply(env, env.fx.eval, [
        ['setDb', newStateOrReducer],
      ].concat(notify ? [['notifyStateListeners']] : []))
    }, // for when you want to bypass the eventing
    regEventFx: (
      // eventName: string,
      eventName: E extends { events: infer U } ? U : never,
      // eventName: MapValue<Env['events'], keyof Env['events']>,
      fn: (state: Env['state'], args: any) => EffectDescription<Env>
    ) => {
      checkType('regEventFx', eventName)
      env.eventFx[eventName] = [...env.eventFx[eventName] || [], fn]
    },
    regFx: (
      type: string,
      fn: (env: Env, args: any) => void
    ) => {
      checkType('regFx', type)
      env.fx[type] = fn
    },
    regReduceFx: (
      type: string,
      fn: (env: Env, acc: Accum<Env>, args: any) => Env['state']
    ) => {
      checkType('regReduceFx', type)
      env.reduceFx[type] = fn
    },
    subscribeToState: f => env.dbListeners!.push(f)
  }
}


const myevt = { 'evt1': 'evt-1111' } as const
const myargs = {
  state: { db: { foo: 42 } },
  fx: {
    'foo': (x: string, y: number) => {
      return null
    },
    'dispatch': (x: string, y: number) => {
      return null
    },
  },
  events: myevt
}
const foo = createStore(myargs)


const testinf = <E>(args?: E extends AnyKV ? E : never) => {
  if (typeof args !== 'undefined') {
    const defaultEnvValue = defaultEnv()
    const merged = Object.entries(defaultEnvValue).reduce((a, [k, v]) => {
      if (defaultEnvValue.hasOwnProperty(k) && args.hasOwnProperty(k)) {
        a[k] = Object.assign({}, defaultEnvValue[k], args[k])
      }
      a[k] = v
      return a
    }, {})
    return merged as ({
        state: Omit<DefaultEnv['state'], keyof typeof args['state']>,
        fx: Omit<DefaultEnv['fx'], keyof typeof args['fx']>,
        reduceFx: Omit<DefaultEnv['reduceFx'], keyof typeof args['reduceFx']>,
        errorFx: Omit<DefaultEnv['errorFx'], keyof typeof args['errorFx']>,

      } & Pick<typeof args, 'state' | 'events' | 'fx' | 'eventFx'>)
  } else {
    return {} as (DefaultEnv & E)
  }
}

const ok = testinf(myargs)
let okk2 = ok.events.evt1
// okk2 = ok.fx.eval()
// ok.fx.dispatch()
// ok.events.evt1
// ok.state.db.foo
//
// ok.reduceFx.
// foo.env.fx.foo('', '')


export type Effect<E> = (env: E, args: any) => any

export type ReduceEffect<E extends any> = (env: E, args: any) => E['state']

export interface IFx<E> {
  [k: string]: Effect<E>
}

export interface IReduceFx<E extends any> {
  [k: string]: ReduceEffect<E>
}

type EventFx<E extends any, Fx> = {
  [K in MapValue<E['events'], keyof E['events']>]: Array<(state: E['state'], args: any) => EffectDescription<Fx>>
}


const myenv = {
  // errorFx: {},
  // eventFx: {},
  events: <const>{ "foo": "foo/fooo" },
  // fx: {},
  // reduceFx: {},
  state: { mys: {} }
}
const nullEffect = ({ state, events }: typeof myenv, foo: [string, number]) => {
  return
}
const myFx = { nullEffect }

const identityReduce: ReduceEffect<typeof myenv> = ({ state, }, args) => {
  return state
}


const fxh = createFxDescriptors(myFx)
const fxDescriptor: ["nullEffect", [string, number]] = fxh.nullEffect('', 42)


const myEfx: EventFx<typeof myenv, typeof myFx> = {
  'foo/fooo': [({ mys }, args: [string, string]) => {
    // return { nullEffect: ['a', 42] }
    // return [['nullEffect', ['a', 42]]]
    return [fxh.nullEffect('', 42)]

  }]
}


// createStore({ state: {}, fx: {} })
// const env: DefaultEnv<any> = defaultEnv()
// applyFx(env,
//   env.fx.eval,
//   []
// )
