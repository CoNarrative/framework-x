import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { FxError } from 'framework-x'
import App from './App'
import * as serviceWorker from './serviceWorker'
import { dispatch, regEventFx } from './App'

ReactDOM.render(<App />, document.getElementById('root'))

regEventFx('foo', ({ db }, args) => {
  if (!args) {
    throw new FxError('foo/args', { message: 'foo event should be dispatched with at least one argument.' })
  }
  return [['db', { cool: false }], ['dispatch', ['bar', null]]]
})

regEventFx('bar', ({ db }, args) => {
  if (!args) {
    throw new FxError('bar/args', {
      message: 'foo event should be dispatched with at least one argument.',
      expected: ['any'],
      received: [args]
    })
  }
  return [['db', { cool: true }] ]
})
dispatch('foo')
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
