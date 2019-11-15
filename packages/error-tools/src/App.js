import React from 'react'
import { createErrorTools } from './lib'
import { Provider, createStore } from 'framework-x'


export const { setState, env, getState, subscribeToState, dispatch, regEventFx } = createStore()

const { FrameworkXErrorTools } = createErrorTools(env)


function App() {
  return (
    <Provider  {...{ getState, dispatch, subscribeToState }}>
      <div className="App">
        <header className="App-header">
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
      <FrameworkXErrorTools />
    </Provider>
  )
}

export default App
