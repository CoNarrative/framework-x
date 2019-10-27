import React from 'react'
import { createErrorTools } from './lib'
import logo from './logo.svg'
import './App.css'
import { Provider, createStore, createSub, derive, component } from 'framework-x'


export const { setState, env, getState, subscribeToState, dispatch, regEventFx } = createStore()

window._env = env

const { FrameworkXErrorTools } = createErrorTools(env)

const foo = derive([x => x ? x.cool : null], (x) => {
  // throw new Error("oops")
})
const TestSel = component('TestSel', createSub({ foo }), ({ foo }) => {
  return (
    <div>{foo}</div>
  )
})

function App() {
  return (
    <Provider  {...{ getState, dispatch, subscribeToState }}>
      <TestSel />
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
      <FrameworkXErrorTools />
    </Provider>
  )
}

export default App
