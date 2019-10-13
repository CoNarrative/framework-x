import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { applyMiddleware, createStore } from 'redux'
import createSagaMiddleware from 'redux-saga'
import 'todomvc-app-css/index.css'
import { frameworkXRedux, makeFrameworkXMiddleware } from 'framework-x-redux'
import App from './components/App'
import { COMPLETE_TODO, DELETE_TODO } from './constants/ActionTypes'
import reducer from './reducers'
import rootSaga from './sagas'
import { assoc } from './util'
import { createStore as frameworkXCreateStore } from 'framework-x'

const { env, regEventFx } = frameworkXCreateStore()

const sagaMiddleware = createSagaMiddleware()
const store = createStore(
  reducer,
  applyMiddleware(
    sagaMiddleware,
    makeFrameworkXMiddleware(env),
  )
)
const { dispatch } = frameworkXRedux(env, store, reducer)
window._env = env
sagaMiddleware.run(rootSaga)


const fy = {
  db: newStateOrReducer => ['db', newStateOrReducer]
}
regEventFx('A', ({ db }, n) => {
  console.log('[fwx] A -> B', db)
  return [
    fy.db(assoc('last', n))
  ]
})
regEventFx('B', ({ db }, n) => {
  console.log('[fwx] B -> null', db)
  return { db: assoc('first', n) }
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
    ['dispatch', [DELETE_TODO, { id: x.id }]],
    ['dispatch', ['A', 1]],
    ['dispatch', ['A', 2]]
  ]
})
window._store = store


render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
