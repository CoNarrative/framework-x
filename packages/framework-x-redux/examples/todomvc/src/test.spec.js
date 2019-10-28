// import { makeInteropDispatch } from '../../src'
// import { toReduxEvent } from './../../src/util'
//
// const fwx_redux = (a, b) => expect(toReduxEvent(a)).toEqual(b)
// describe('framework-x event -> Redux action', () => {
//   it('works', () => {
//     fwx_redux(
//       ['A'],
//       { type: 'A' })
//     fwx_redux(
//       ['A', 1],
//       { type: 'A', payload: 1 })
//     fwx_redux(
//       ['A', [1]],
//       { type: 'A', payload: [1] })
//     fwx_redux(
//       ['A', { foo: 1 }],
//       { type: 'A', foo: 1 })
//     fwx_redux(
//       ['A', { foo: 1, bar: 2 }],
//       { type: 'A', foo: 1, bar: 2 }
//     )
//     fwx_redux(
//       ['A', { foo: 1 }, { bar: 2 }],
//       { type: 'A', payload: [{ foo: 1 }, { bar: 2 }] }
//     )
//   })
// })
//
// const makeTestDispatch = (evts = []) => {
//   return [evts, makeInteropDispatch({ dispatch: x => evts.push(x) })]
// }
// const expectReduxEvents = (as, bs) => {
//   expect(as).toEqual(bs)
// }
// describe('framework-x dispatch', () => {
//   it('works1', () => {
//     const [evts, dispatch] = makeTestDispatch()
//     dispatch(['A'])
//     expectReduxEvents(evts, [{ type: 'A' }])
//   })
//
//   it('works2', () => {
//     const [evts, dispatch] = makeTestDispatch()
//     dispatch(['A', 1])
//     expectReduxEvents(evts, [{ type: 'A', payload: 1 }])
//   })
//
//   it('works vector 1', () => {
//     const [evts, dispatch] = makeTestDispatch()
//     dispatch([['A', 1], ['B', 2]])
//     expectReduxEvents(evts, [{ type: 'A', payload: 1 }, { type: 'B', payload: 2 }])
//   })
//
//   it('works vector 2', () => {
//     const [evts, dispatch] = makeTestDispatch()
//     dispatch([['A', 1], ['B', 2], ['B', 3], ['B', 4], ['B', 5]])
//     expectReduxEvents(evts, [
//       { type: 'A', payload: 1 },
//       { type: 'B', payload: 2 },
//       { type: 'B', payload: 3 },
//       { type: 'B', payload: 4 },
//       { type: 'B', payload: 5 }
//     ])
//   })
// })
