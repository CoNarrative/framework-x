import ReactDOM from 'react-dom'
import React from 'react'
import { evt } from './eventTypes'
import { Provider } from 'framework-x'
import { startRouter } from './router'
import { store, dispatch, regEventFx, subscribeToState, getState } from './store'
import './events'

import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import { App } from './App'

regEventFx(evt.INITIALIZE_DB, (_, __, state) => {
  return { db: state }
})
dispatch(evt.INITIALIZE_DB, { articles: [] })

startRouter()
ReactDOM.render((
  <Provider
    subscribeToState={subscribeToState}
    dispatch={dispatch}
    getState={getState}>
    <App />
  </Provider>

), document.getElementById('root'))

window._store = store
