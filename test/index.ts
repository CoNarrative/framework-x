import { EffectDescription, MapValue } from "../src"
import { createFxDescriptors, createStore } from "../src/createStoreTyped"

const myevt = { 'evt1': 'evt-1111' } as const
const myargs = {
  state: { db: { foo: 42 } },
  fx: {
    'foo': (x: any, y: [number]) => {
      return null
    },
    // 'dispatch': (x: string, y: number) => {
    //   return null
    // },
  },
  events: myevt
}
const foo = createStore(myargs)
foo.regEventFx('evt-1111',({db:{foo}},_:any)=>{
  // return [['foo', 42]]
  return {dispatch:[42,42]}
})
foo.env.fx.dispatch(foo.env,['a'])
foo.dispatch('a')
foo.regFx('hey',(e,a)=>{
  e.fx.eval(foo.env,['setDb',()=>{}])

})

// const testinf = <E>(args?: E extends AnyKV ? E : never) => {
//   if (typeof args !== 'undefined') {
//     const defaultEnvValue = defaultEnv()
//     const merged = Object.entries(defaultEnvValue).reduce((a, [k, v]) => {
//       if (defaultEnvValue.hasOwnProperty(k) && args.hasOwnProperty(k)) {
//         a[k] = Object.assign({}, defaultEnvValue[k], args[k])
//       }
//       a[k] = v
//       return a
//     }, {})
//     return merged as ({
//         state: Omit<DefaultEnv['state'], keyof typeof args['state']>,
//         fx: Omit<DefaultEnv['fx'], keyof typeof args['fx']>,
//         reduceFx: Omit<DefaultEnv['reduceFx'], keyof typeof args['reduceFx']>,
//         errorFx: Omit<DefaultEnv['errorFx'], keyof typeof args['errorFx']>,
//
//       } & Pick<typeof args, 'state' | 'events' | 'fx' | 'eventFx'>)
//   } else {
//     return {} as (DefaultEnv & E)
//   }
// }
//
// const ok = testinf(myargs)
// let okk2 = ok.events.evt1
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
