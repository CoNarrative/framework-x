import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import createSagaMiddleware from 'redux-saga'
import 'todomvc-app-css/index.css'
import { frameworkXRedux, makeFrameworkXMiddleware } from 'framework-x-redux'
import App from './components/App'
import { ADD_TODO, COMPLETE_TODO, DELETE_TODO } from './constants/ActionTypes'
import reducer from './reducers'
import rootSaga from './sagas'
import { assoc } from './util'
import { createStore as frameworkXCreateStore } from 'framework-x'
import * as R from 'ramda'

const { env, regEventFx, regFx } = frameworkXCreateStore()

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  composeWithDevTools(
    applyMiddleware(
      makeFrameworkXMiddleware(env),
      sagaMiddleware,
    )
  )
)
const { dispatch } = frameworkXRedux(env, store, reducer)
window._env = env
sagaMiddleware.run(rootSaga)

regFx('logState', (env) => {
  console.log('LOG state', Object.assign({}, env.state.db))
})

const fy = {
  db: newStateOrReducer => ['db', newStateOrReducer]
}
regEventFx('A', ({ db }, n) => {
  console.log('[fwx] A -> B', db)
  return [
    fy.db(assoc('last', n)),
    ['dispatch', [ADD_TODO, { text: 'use framework-x', completed: false }]],
  ]
})
regEventFx('B', ({ db }, n) => {
  console.log('[fwx] B -> null', db)
  return { db: assoc('first', n) }
})
regEventFx('cool/toggle', ({ db }, { value }) => {
  return { db: R.assoc('cool', value) }
})

regEventFx(COMPLETE_TODO, ({ db }, x) => {
  console.log('framework-x handler 1', db, x)
  return [
    ['db', Object.assign(
      {}, db,
      {
        todos: db.todos.map((todo) =>
          todo.id === x.id
          ? Object.assign({}, todo, { completed: true })
          : todo)
      })],
    ['logState'],
    ['dispatch', [DELETE_TODO, { id: x.id }]],
    ['dispatch', ['A', 1]],

    ['logState'],
    ['dispatch', ['B', 2]]
  ]
})
window._store = store


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
