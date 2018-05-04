import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './views/App'
import './events'
import { dispatch, Provider } from './store'
import { startRouter } from './routing'

dispatch('initialize-db')
startRouter(locationAndMatch => {
  dispatch('route-change', locationAndMatch)
})

ReactDOM.render(
  <Provider>
    <App/>
  </Provider>,
  document.getElementById('root'))
// registerServiceWorker()
