// declare module "framework-x" {


type Tail<T extends any[]> = ((...t: T) => void) extends ((x: any, ...u: infer U) => void) ? U : never;
type Rest  <T extends any[],U=unknown> = T extends [any,...any[]] ? U:never
type TailParameters<T extends (...args: any) => any> = T extends (x: any, args: infer P) => any ? P : never;
type AnyKV = { [k: string]: any }

export type DbListener<State extends any> = (db: State['db']) => void

export type ErrorEffect<E> = (env: E, acc: Accum<E>, e: Error) => any

export type EnvWith<KS extends keyof DefaultEnv> = Pick<DefaultEnv, KS>

export type DispatchEnv<E> =
  Required<EnvWith<'fx' | 'state' | 'eventFx' | 'reduceFx'>>
  & { events?: E extends {events: infer  U} ? U  : string, errorFx?: ErrorEffect<E> }


export type EventVector<E> = [E extends { events: any } ? EventName<E> : string, any?]

interface StateMap {
  [k: string]: any
}

interface EventMap {
  readonly [k: string]: string
}

export type EventName<E extends { events: any }> = MapValue<E['events'], keyof E['events']>

export type EffectTuple<Fx extends AnyKV> = {
  [K in keyof Fx]: Fx[K] extends (_: any, args: infer U) => void
    ? U extends any ? [K, U] : [K]
    : never
}[keyof Fx]

// any key is valid, doesn't need to be registered
export type LooseEffectDescription = [string, any] | [string]

export type EffectDescription<Fx extends any> =
  Partial<{[K in keyof Fx]: TailParameters<MapValue<Fx,K>>}>
  | EffectTuple<Fx>[]

type EventEffectHandler<State, T = any> = (
  state: State,
  eventArgs: T
) => EffectDescription<T> | void

export type NewStateOrReducer<E extends any> = any | ((db: E['state']['db']) => any)

// todo maybe use this as a generic to receive event  map args from createStore
// for fx typed with the created env, including event types
export type  DefaultFxMap = {
  dispatch: (env: DefaultEnv, event: [string, any]) => void
  eval: (env: DefaultEnv, effect: [keyof DefaultFxMap,any]) => void
  apply: any
  applyImpure: any
  setDb: (env: { state: { db: any } }, newStateOrReducer: any) => void
  notifyStateListeners: any
  notifyEventListeners: any
}

type Accum<E extends any> = {
  state: E['state'],
  reductions: any[],
  stack: EffectTuple<E>[],
  queue: LooseEffectDescription[]
  events:any[]
}

export interface DefaultEnv {
  state: { db: any }
  reduceFx: {
    db: (env: DefaultEnv, acc: any, newStateOrReducer: any) => any
  }
  fx: {
    dispatch: (env: DefaultEnv, event: [string, any] | [string]) => void
    eval: (env: DefaultEnv, effect: EffectTuple<Omit<DefaultEnv['fx'], 'eval'>>) => void
    apply: any
    applyImpure: any
    setDb: (x: { state: { db: any } }, newStateOrReducer: any) => void
    notifyStateListeners: any
    notifyEventListeners: any
    handleError: (env: any, acc: any, e: Error) => void
    resume: (env: DefaultEnv, prevAcc: any, acc: any) => void
  }
  events: any,
  eventFx: any,
  errorFx?: any
  dbListeners?: DbListener<DefaultEnv['state']>[],
  eventListeners?: Array<(...any: any) => any>,
}



export declare interface Environment<State extends StateMap,
  EvtMap extends EventMap,
  > {
  state: State
  acc?:any
  fx: { [k: string]: (env: Partial<Environment<State, EvtMap>>, ...args: any[]) => void }
  reduceFx: {[k:string]:(env: Environment<State,EvtMap>,args:any )=>any}
  eventFx: {
    [K in MapValue<EvtMap, keyof EvtMap>]: EventEffectHandler<State>[]
  }
  events: EvtMap,
  dbListeners: DbListener<State>[]
  eventListeners?: Array<(type: MapValue<EvtMap, keyof EvtMap>, data?: any) => void>
}

type MapValue<M, K extends keyof M> = M[K]

export interface IEnv {
  state?: AnyKV
  fx?: AnyKV
  eventFx?: AnyKV
  reduceFx?: AnyKV
  errorFx?: AnyKV
  events?: AnyKV
  dbListeners?: any[]
  eventListeners?: any[]
}

export interface Store<
  State extends AnyKV,
  EvtMap extends EventMap,
  E extends any
  > {
  env: E extends IEnv ? (E & DefaultEnv) : DefaultEnv

  getState(): State['db']

  regEventFx<
    Events extends E['events'],
    Fx extends E['fx'],
    >(eventType: MapValue<Events, keyof Events>,
      fn: (state: E['state'] , eventArgs: any) => EffectDescription<Fx>
  ): void;

  dispatch<Env extends Environment<State, EvtMap>,
    Evt extends MapValue<EvtMap, keyof EvtMap>>(
    eventType: Evt,
    args: Env['eventFx'][Evt][0] extends (a: any, ...args: infer T) => any ? T : never
  ): void;

  subscribeToState(fn: DbListener<State>): void


  setState: any
  regFx: any,
  regReduceFx: any,

}

// export function createStore<State extends StateMap,
//   EvtMap extends EventMap,
//   E extends IEnv>
// (env: E): Store<State, EvtMap,E>

