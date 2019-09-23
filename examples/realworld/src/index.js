import ReactDOM from 'react-dom'
import React from 'react'
import * as R from 'ramda'
import { evt } from './eventTypes'
import { Provider } from 'framework-x'
import { regLocalStorageFx } from './fx'
import { startRouter } from './router'
import { store, dispatch, regEventFx, subscribeToState, getState, setState } from './store'
import './events'
import { App } from './App'
import { parseJwt } from './util'


regLocalStorageFx({ localStorage: window.localStorage, setState })

const setUserFromLocalStorage = (ls, setState) => {
  const token = ls.getItem('jwt')
  const user = parseJwt(token)
  let fns = []
  user && fns.push(R.assoc('user', user))
  token && fns.push(R.assoc('token', token))
  fns.length && setState(R.pipe(...fns))
}

regEventFx(evt.INITIALIZE_DB, (_, state) => ({
  db: state,
  localStorage: setUserFromLocalStorage
}))

dispatch(evt.INITIALIZE_DB, { articles: [] })

startRouter()
ReactDOM.render(
  <Provider
    subscribeToState={subscribeToState}
    dispatch={dispatch}
    getState={getState}>
    <App />
  </Provider>, document.getElementById('root'))

window._store = store
