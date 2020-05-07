import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import { visibilityFilter } from './constants'
import { evt } from './eventTypes'
import { startRouter } from './router'
import { getState, setState, dispatch, subscribeToState, store } from './store'
import './events'
import { Provider } from "framework-x"

dispatch(evt.INITIALIZE_DB, {
  todos: [],
  visibilityFilter: visibilityFilter.ALL,
  newTodoText: '',
  notifications: []
})
startRouter()
if (process.env.NODE_ENV !== 'production') {
  // @ts-ignore
  window._store = store
}

ReactDOM.render(
  <Provider
    subscribeToState={subscribeToState}
  getState={getState}
  dispatch={dispatch}>

    <App />
  </Provider>,
  document.getElementById('root'))


