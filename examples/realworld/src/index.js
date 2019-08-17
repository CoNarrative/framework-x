import ReactDOM from 'react-dom'
import React from 'react'
import * as R from 'ramda'
import { getToken, isLoggedIn } from './auth/selectors'
import { evt } from './eventTypes'
import { Provider } from 'framework-x'
import { startRouter } from './router'
import { store, dispatch, regEventFx, subscribeToState, getState } from './store'
import './events'
import { App } from './App'
import { parseJwt } from './util'

regEventFx(evt.INITIALIZE_DB, (_, __, state) => {
  return { db: state }
})

dispatch(evt.INITIALIZE_DB,
  R.mergeAll([
    { articles: [] },
    isLoggedIn()
    ? { user: parseJwt(getToken()) }
    : {}
  ]))

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
