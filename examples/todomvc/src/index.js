import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App, { INITIALIZE_DB } from './App'
import { Provider } from 'framework-x'
import { getState, dispatch, subscribeToState } from './store'

dispatch([INITIALIZE_DB])

ReactDOM.render(
  <Provider
    getState={getState}
    dispatch={dispatch}
    subscribeToState={subscribeToState}>
    <App />
  </Provider>,
  document.getElementById('root'))
