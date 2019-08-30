import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import { Provider } from 'framework-x'
import { visibilityFilter } from './constants'
import { evt } from './eventTypes'
import { startRouter } from './router'
import { getState, setState, dispatch, subscribeToState, store } from './store'
import './events'

dispatch(evt.INITIALIZE_DB, {
  todos: [],
  visibilityFilter: visibilityFilter.ALL,
  newTodoText: '',
  notifications: []
})
startRouter()
if (process.env !== 'production') {
  window._store = store
}

ReactDOM.render(
  <Provider
    getState={getState}
    setState={setState}
    dispatch={dispatch}
    subscribeToState={subscribeToState}>
    <App />
  </Provider>,
  document.getElementById('root'))


