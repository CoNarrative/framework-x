import ReactDOM from 'react-dom'
import React from 'react'
import { evt } from './eventTypes'
import { Provider } from 'framework-x'
import { localStorageFx } from './fx'
import { createFx } from '@framework-x/fetch-fx'
import { startRouter } from './router'
import { store, dispatch, subscribeToState, getState, regFx, setState } from './store'
import './events'
import { App } from './App'


const ff = createFx({ dispatch, fetch: window.fetch })
  console.log('ff',ff)
regFx('fetch', ff)
regFx('localStorage', localStorageFx({ localStorage: window.localStorage, setState }))
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
