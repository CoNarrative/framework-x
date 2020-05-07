// //
// // export const fx = {
// //   db: (newStateOrReducer) => ['db', newStateOrReducer],
// //   dispatch: (...args) => ['dispatch', args],
// //   notification: ({ type, message, duration }) => ['notification', {
// //     type,
// //     message,
// //     duration
// //   }]
// // }
//
//
// import { createFxDescriptors } from "framework-x"
//
// type FxHandler<S, Fx> = (env: { state: S } & { fx: Fx }, ...args: any[]) => void
// type EventFxHandler<S, Fx> = (state: S, ...args: any[]) => [Fx][]
//
//
// type Get<M, K extends keyof M> = M[K]
// type Values<M> = M[keyof M]
// // type EventArgsMap =
// // const fx = {
// //   dispatch: < M extends MyEvents, K in M>(evt: T, args: any) =>
// //     ['dispatch', [evt=="my-event", args]],
// //
// // } as const
//
//
// type Db = {
//   fooState: string
// }
//
// const evt = {
//   SELECT: 'select'
// } as const
//
// export type EventNames<EventMap extends { [k: string]: any }> = Values<EventMap>
// type MyEventNames = EventNames<typeof evt>
//
//
// const EventFns = { //:   { [k in MyEventNames]: (...args: any[]) => any } = {
//   [evt.SELECT]: ({ id }: { id: string }) => id
// } as const
//
// const myEventHandlers: {
//   [EventName in MyEventNames]: (ctx: { db: Db }, ...args: Parameters<typeof EventFns[EventName]>) => any
// } = {
//   [evt.SELECT]: ({ db }, { id }) => {
//
//
//   },
//   // ["my-event"]: ({ db }, { foo }) => {
//   //   db.fooState
//   //   foo.trim()
//   // }
// }
// const fx  ={
//   route: (path, args) => ['route', [path, args]],
// } as const
//
// interface IMessage {
//   eventName: string
// }
//
// class SelectEvent implements IMessage {
//   public static eventName: string = 'select'
//
//   public id: any
//
//   constructor({ id }) {
//     this.id = id
//   }
// }
//
// const regHandler: <T extends IMessage>(t: T, fn: (ctx: { db: Db }, args: T) => any) => {
//   regEventFx(
//     t.,
//   fn
//   )
// }
//
// // dispatch(new SelectEvent({ id: 2 }))
// // regEventFx<T>(T, (T) => any)
//
// // const events = [{ name: , fn: ({ id }) => id }]
