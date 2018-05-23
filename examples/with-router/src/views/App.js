import React from 'react';
import { mainSub, appSub } from '../subs'
import './App.css';
import { component, connect, dispatch } from '../store'

const Item = component('Item', ({ id, name }) => (
  <div>
    {id}: {name}
  </div>
))
const UsingConnect = connect(appSub)(
  class UsingConnectInner {
    render(){
      const {formattedCount} = this.props
      return (
        <div>FormattedCountAgain: {formattedCount}</div>
      )
    }
  }
)
const Main = component('Main', {
    subscribe: mainSub,
  },
  ({ otherwise, formattedCount }) => (
    <div>Otherwise: {otherwise ? 'true' : 'false'} {formattedCount}</div>
  ))

const App = component('App', {
    subscribe: appSub,
    devTools: true,
  },
  ({ formattedCount }) => (
    <div>
      <div>{formattedCount}</div>
      <button
        onClick={() => dispatch('increment', 5)}
      >
        Increment
      </button>
      <button
        onClick={() => dispatch('otherwise')}
      >
        Otherwise
      </button>
      <Item id={0} name="Hello" />
      <Main id={1} formattedCount={formattedCount} />
      <Main id={2} />
      <UsingConnect/>
    </div>
  ),
)


// const App2 = component('App', mainSub, ({ formattedCount }) => (
//   <div>
//     <div>{formattedCount}</div>
//     <button
//       onClick={() => dispatch('increment', 5)}
//     >
//       Increment
//     </button>
//     <Item id={0} name="Hello" />
//   </div>
// ))
//
// const App3 = component({
//   name: 'App',
//   connect: mainSub,
// })(({ formattedCount }) => (
//   <div>
//     <div>{formattedCount}</div>
//     <button
//       onClick={() => dispatch('increment', 5)}
//     >
//       Increment
//     </button>
//     <Item id={0} name="Hello" />
//   </div>
// ))
//
// const App4A = component('App', {
//     connect: mainSub,
//     propsHash: ({ formattedCount }) => `${formattedCount}`,
//   },
//   ({ formattedCount }) => (
//     <div>
//       <div>{formattedCount}</div>
//       <button
//         onClick={() => dispatch('increment', 5)}
//       >
//         Increment
//       </button>
//       <Item id={0} name="Hello" />
//     </div>
//   ),
// )
// //unconnected shortcut/sugar for 4A
// const App4B = component('App', mainSub,
//   ({ formattedCount }) => (
//     <div>
//       <div>{formattedCount}</div>
//       <button
//         onClick={() => dispatch('increment', 5)}
//       >
//         Increment
//       </button>
//       <Item id={0} name="Hello" />
//     </div>
//   ),
// )


// const App4 = component({
//     name: 'App',
//     connect: mainSub,
//     propsHash: ({ formattedCount }) => `${formattedCount}`,
//   },
//   ({ formattedCount }) => (
//     <div>
//       <div>{formattedCount}</div>
//       <button
//         onClick={() => dispatch('increment', 5)}
//       >
//         Increment
//       </button>
//       <Item id={0} name="Hello" />
//     </div>
//   ),
// )
//
//
// const App5 = component({
//   name: 'App',
//   connect: mainSub,
//   propsHash: ({ formattedCount }) => `${formattedCount}`,
//   render: ({ formattedCount }) => (
//     <div>
//       <div>{formattedCount}</div>
//       <button
//         onClick={() => dispatch('increment', 5)}
//       >
//         Increment
//       </button>
//       <Item id={0} name="Hello" />
//     </div>
//   ),
// })
//
// const App7 = component(mainSub)(({ formattedCount }) =>
//   <div>
//     <div>{formattedCount}</div>
//     <button
//       onClick={() => dispatch('increment', 5)}
//     >
//       Increment
//     </button>
//     <Item id={0} name="Hello" />
//   </div>,
// )


export default App;
