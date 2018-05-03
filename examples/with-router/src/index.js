import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './views/App'
import './events' //self-registers
import { Provider } from './store'


ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'))
// registerServiceWorker()
