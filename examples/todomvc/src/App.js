import React from 'react'
import * as R from 'ramda'
import { component, createSub, derive } from 'framework-x'
import { dispatch, regEventFx } from './store'

const getVisibilityFilter = R.path(['visibilityFilter'])
const getAllTodos = R.path(['todos'])
const getNewTodoText = R.path(['newTodoText'])

const updateIn = R.curry((ks, f, m) => R.assocPath(ks, f(R.path(ks, m)), m))

const visibleTodos = derive(
  [getVisibilityFilter, getAllTodos],
  (filter, todos) => {
    switch (filter) {
      case visibilityFilter.DONE:
        return R.filter(R.prop('done'), todos)
      case visibilityFilter.NOT_DONE:
        return R.reject(R.prop('done'), todos)
      case visibilityFilter.ALL:
        return todos
      default:
        console.error('unhandled visibility filter', filter)
        return todos
    }
  })

export const evt = {
  INITIALIZE_DB: 'initialize-db',
  SET_TODO_TEXT: 'set-todo-text',
  CHANGE_FILTER: 'change-filter',
  ADD_TODO: 'add-todo',
  TOGGLE_DONE: 'toggle-done',
}

export const visibilityFilter = {
  ALL: 'all',
  DONE: 'done',
  NOT_DONE: 'not-done'
}


regEventFx(evt.INITIALIZE_DB, ({ db }, _) => ({
  db: {
    todos: [],
    visibilityFilter: visibilityFilter.ALL,
    newTodoText: ''
  }
}))

regEventFx(evt.SET_TODO_TEXT, ({ db }, _, value) => ({
  db: R.assoc('newTodoText', value),
}))

regEventFx(evt.CHANGE_FILTER, ({ db }, _, value) => ({
  db: R.assoc('visibilityFilter', value)
}))

regEventFx(evt.ADD_TODO, ({ db }) => ({
  db: updateIn(['todos'],
    R.append({
      text: getNewTodoText(db),
      done: false
    })),
  dispatch: [evt.SET_TODO_TEXT, '']
}))

regEventFx(evt.TOGGLE_DONE, ({ db }, _, doneText) => ({
  db: updateIn(
    ['todos'],
    R.map(todo =>
      todo.text === doneText
      ? updateIn(['done'], R.not, todo)
      : todo))

}))

const EnterTodo = component('EnterTodo',
  createSub({ text: getNewTodoText }),
  ({ text }) =>
    <div>
      <input
        value={text || ''}
        onChange={e => dispatch(evt.SET_TODO_TEXT, e.target.value)}
        onKeyDown={e => e.which === 13 && dispatch([evt.ADD_TODO])}
      />
      <button onClick={() => dispatch(evt.ADD_TODO)}>
        Add todo
      </button>
    </div>
)

const Todos = component('Todos',
  createSub({
    todos: visibleTodos
  }),
  ({ todos }) =>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {todos && todos.map(({ text, done }, i) =>
        <div
          key={i}
          style={{ display: 'flex' }}>
          {done
           ? <strike>{text}</strike>
           : <div>{text}</div>}
          <button onClick={() => dispatch(evt.TOGGLE_DONE, text)}>
            Toggle done
          </button>
        </div>
      )}
    </div>
)

const App = () => (
  <div style={{ height: '100vh' }}>
    <EnterTodo />
    <Todos />
    <VisibilityFilters />
  </div>
)

const visibilityFilters = [
  {
    id: visibilityFilter.DONE,
    label: 'Show done',
    event: [evt.CHANGE_FILTER, visibilityFilter.DONE]
  },
  {
    id: visibilityFilter.NOT_DONE,
    label: 'Show not done',
    event: [evt.CHANGE_FILTER, visibilityFilter.NOT_DONE]
  },
  {
    id: visibilityFilter.ALL,
    label: 'Show all',
    event: [evt.CHANGE_FILTER, visibilityFilter.ALL]
  }
]

const visibilityButtonStyle = (isSelected) =>
  isSelected
  ? { background: 'green', color: 'white' }
  : {}

const VisibilityFilters = component('VisibilityFilters',
  createSub({ selectedFilter: getVisibilityFilter }),
  ({ selectedFilter }) =>
    <div>
      {visibilityFilters.map(({ id, label, event }, i) =>
        <button
          key={i}
          style={visibilityButtonStyle(id === selectedFilter)}
          onClick={() => dispatch(event)}>
          {label}
        </button>
      )}
    </div>
)

export default App
