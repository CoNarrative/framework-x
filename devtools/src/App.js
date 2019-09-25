import React from 'react'
import { createDevtools } from './lib'
import logo from './logo.svg'
import './App.css'
import { Provider, createStore } from 'framework-x'


export const { setState, env, getState, subscribeToState, dispatch, regEventFx } = createStore()

window._env = env

const { FrameworkXDevtools } = createDevtools(env)

function App() {
  return (
    <Provider  {...{ getState, dispatch, subscribeToState }}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
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
      <FrameworkXDevtools />
    </Provider>
  )
}

export default App
