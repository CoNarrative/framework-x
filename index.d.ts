declare module "framework-x" {
  export type Db = object
  export type EventType = string
  export type Payload = any
  export type Event = [EventType, Payload?]
  export type DbFn = (db: Db) => Db
  export type FxName = "db" | any
  export type FxArg = any
  export type Effects = { db: DbFn | Db } & { [k in FxName]: FxArg }

  export interface Effect {
    (x: any): any
  }

  export function dispatch(...event: Event): void;
  export function dispatch(eventType: EventType, ...args: [any]): void;

  export type Coeffects = { db: Db } & { [k: string]: any }

  export type Handler = (cofx: Coeffects, eventType: EventType, args: Payload) => Effects | void

  export function regEventFx(eventType: EventType, handler: Handler): void;

  export function regFx(name: FxName, fn: Effect):void

  export function getState(): Db

  type StateListener = (db: Db) => any

  export function subscribeToState(fn: StateListener): void

  type Middleware = (type: string, payload: any, effects: any) => any

  export function createStore(initialState?: object): { dispatch, getState, setState, regEventFx, regFx, subscribeToState }
}
