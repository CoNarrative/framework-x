// declare module "framework-x" {


type Tail<T extends any[]> = ((...t: T) => void) extends ((x: any, ...u: infer U) => void) ? U : never;
type Rest  <T extends any[],U=unknown> = T extends [any,...any[]] ? U:never
type TailParameters<T extends (...args: any) => any> = T extends (x: any, ...args: infer P) => any ? P : never;

export type StateListener<State extends StateMap> = (db: State['db']) => void

export type Db = {}

export type DbFn = (db: Db) => Db


// export type FxFn<State extends StateMap,
//   Events extends EventMap,
//   Env extends Environment<State, Events>> = (env: Env, fn: Env['fx']) => void


// export type FxDescription<FxMap> = { db: DbFn | Db } & FxMap | FxDescriptionEntry<FxMap, keyof FxMap>[]

interface StateMap {
  [k: string]: any
}

interface EventMap {
  readonly [k: string]: string
}

type EventEffectFn<State, T = any> = (
  state: State,
  eventArgs: T
) => EffectDescription<T> | void

type EventEffect<State, EvtMap extends EventMap, PreEventFx extends { [k: string]: any }> =
  Array<EventEffectFn<State & { [k in keyof PreEventFx]: any }>>


export interface IdentityEnv {
  state: { db: {}, dispatch: { depth: 0 } },
  preEventFx: {},
  fx: {
    db: (env: ThisType<IdentityEnv>, newStateOrReducer: any) => void
    dispatch: (env: ThisType<IdentityEnv>, event: [string, ...any[]]) => void
  }
  events: {},
  eventFx: {},
  dbListeners: [],
  eventListeners: [],
}


export interface Environment<State extends StateMap,
  EvtMap extends EventMap,
  > {
  state: State
  fx: { [k: string]: (env: Partial<Environment<State, EvtMap> & IdentityEnv>, ...args: any[]) => void }
  preEventFx: { [k: string]: (env: Partial<Environment<State, EvtMap>>) => any }
  eventFx: {
    [K in MapValue<EvtMap, keyof EvtMap>]: EventEffect<State, EvtMap, Environment<State, EvtMap>['preEventFx']>
  }
  events: EvtMap,
  dbListeners: StateListener<State>[]
  eventListeners?: Array<(type: MapValue<EvtMap, keyof EvtMap>, data?: any) => void>
}

export type EffectsMap<State extends StateMap> = { [k: string]: (env: State, ...args: any[]) => void }

export type FxDescriptionEntry<FxMap extends any > =
  { [K in keyof FxMap]: FxMap[K] extends (_: any, ...xs: infer U) => void ? [K,U] : never }[keyof FxMap]





type FxDescriptorFnMap<FxMap extends any> = {[K in keyof FxMap]: (...args: TailParameters<FxMap[K]>)=>
[K, TailParameters<FxMap[K]>]}

export type EffectDescription<FxMap extends {[k:string]:any}> =
  {[K in keyof FxMap]: TailParameters<MapValue<FxMap,K>>}
  | FxDescriptionEntry<FxMap>[]
// |FxDescriptorFnMap<FxMap>[keyof FxMap][] // just describes the entries type as a fn, we want the return value (the entries)


type MapValue<M, K extends keyof M> = M[K]

export interface EnvObj<State extends StateMap,EvtMap extends EventMap> {
  state: State
  fx: any
  preEventFx: any
  eventFx: any
  events: EvtMap,
  dbListeners?: StateListener<State>[]
  eventListeners?: any
}
export interface Store<
  State extends StateMap,
  EvtMap extends EventMap,
  Env extends EnvObj<State,EvtMap>
  > {
  env: Env & IdentityEnv

  getState(): State['db']

  regEventFx<
    Events extends Env['events'],
    PreEventFx extends Env['preEventFx'],
    Fx extends Env['fx'],
    >(eventType: MapValue<Events, keyof Events>,
      fn: (state: Env['state'] & { [K in keyof PreEventFx]: ReturnType<PreEventFx[K]> },
           eventArgs: any) => EffectDescription<Fx>
      // { [K in keyof Fx]: (args: Tail<Parameters<Fx[K]>>) => void } | void,
      // fn: (state: State & { [K in keyof PreEventFx]: ReturnType<PreEventFx[K]> },
      //      eventArgs: any) => { [K in keyof Fx]: (args: Tail<Parameters<Fx[K]>>) => void } | void,
  ): void;

  regFx: any,
  regPreEventFx: any

  dispatch<Env extends Environment<State, EvtMap>,
    Evt extends MapValue<EvtMap, keyof EvtMap>>(
    eventType: Evt,
    ...args: Env['eventFx'][Evt][0] extends (a: any, ...args: infer T) => any ? T : never
  ): void;

  subscribeToState(fn: StateListener<State>): void
}

export function createStore<State extends StateMap,
  EvtMap extends EventMap,
  E extends EnvObj<State,EvtMap>>
(env: E): Store<State, EvtMap,E>

