

declare module "framework-x" {
  export type EventName = string
  export type EventData = any
  export type Event = [EventName, EventData?]
  export type DbFn = (db: Db) => Db
  export type FxName = "db" | "dispatch" | string
  export type FxArg = any
  export type Effects = { db: DbFn | Db } & { [k in FxName]: FxArg }
    | [FxName, FxArg][]

  export type Db = object

  export function dispatch(...event: Event): void;
  export function dispatch(eventType: EventName, ...args: [any]): void;

  export type Coeffects = { db: Db } & { [k: string]: any }

  export type Handler = (cofx: Coeffects, eventType: EventName, args: EventData) => Effects | void

  export function regEventFx(eventType: EventName, handler: Handler): void;

  export interface Effect {
    (x: any): any
  }

  export function regFx(name: FxName, fn: Effect): void

  export function getState(): Db

  type StateListener = (db: Db) => void

  export function subscribeToState(fn: StateListener): void

  type EventListener = (type: string, payload: any, effects: any) => any

  export interface Store {
    getState(): Db

    dispatch(...event: Event): void;

    dispatch(eventType: EventName, ...args: [any]): void;

    regEventFx(eventType: EventName, handler: Handler): void;

    regFx(name: FxName, fn: Effect): void

    subscribeToState(fn: StateListener): void
  }

  export function createStore(initialState?: object): Store
}
