import React from 'react'
import { mainSub } from '../subs'
import './App.css'
import { Subscriber, dispatch } from '../store'

const App = () => (
  <Subscriber
    selector={mainSub}
  >
    {({ formattedCount }) => {
      return (
        <div>
          <div>{formattedCount}</div>
          <button
            onClick={() => dispatch('increment', 5)}
          >
            Increment
          </button>
        </div>
      )
    }}
  </Subscriber>
)
export default App
