import { Provider } from 'framework-x'
import React from 'react'
import ReactDOM from 'react-dom'
import './events'
import './index.css'
import { startRouter } from './routing'
import { dispatch, getState, subscribeToState } from './store'
import App from './views/App'

dispatch('initialize-db')
startRouter(locationAndMatch => {
  dispatch('route-change', locationAndMatch)
})

ReactDOM.render(
  <Provider
    getState={getState}
    subscribeToState={subscribeToState}
  >
    <App />
  </Provider>,
  document.getElementById('root'))
// registerServiceWorker()
