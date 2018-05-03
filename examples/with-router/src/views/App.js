import React from 'react';
import { mainSub } from '../subs'
import './App.css';
import { component, dispatch } from '../store'

const Item = component('Item', ({ id, name }) => (
  <div>
    {id}: {name}
  </div>
))
console.log({ Item })


const App = component('App', {
    subscribe: mainSub,
    propsHash: ({ formattedCount }) => `${formattedCount}`,
  },
  ({ formattedCount }) => (
    <div>
      <div>{formattedCount}</div>
      <button
        onClick={() => dispatch('increment', 5)}
      >
        Increment
      </button>
      <Item id={0} name="Hello" />
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
