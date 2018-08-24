import React from 'react'
import { component } from 'framework-x'
import './App.css'
import { createSub, derive } from 'framework-x'
import { dispatch, regEventFx } from '../store'


const visibilityFilter = db => db.visibilityFilter

const allTodos = db => db.todos

const visibleTodos = derive([visibilityFilter, allTodos],
  (filter, todos) => {
    switch (filter) {
      case "done":
        return todos.filter(todo => todo.done)
      case "not done":
        return todos.filter(todo => !todo.done)
      default:
        return allTodos
    }
  })

export const INITIALIZE_DB = 'initialize-db'
const SET_TODO_TEXT = 'set-todo-text'
const CHANGE_FILTER = 'change-filter'
const ADD_TODO = 'add-todo'
const MARK_DONE = 'mark-done'

regEventFx(INITIALIZE_DB, ({ db }, _, __) => ({
  db: { todos: {}, visibilityFilter: "all" },
}))

regEventFx(SET_TODO_TEXT, ({ db }, _, value) => ({
  db: Object.assign({}, db, { newTodoText: value }),
}))

regEventFx(CHANGE_FILTER, ({ db }, _, value) => ({
  db: Object.assign({}, db, { visibilityFilter: value }),
}))

regEventFx(ADD_TODO, ({ db }, _, __) => ({
  db: Object.assign({}, db, {
    todos: db.todos.concat({ text: db.newTodoText, done: false }),
  }),
  dispatch: [SET_TODO_TEXT, ""],
}))

regEventFx(MARK_DONE, ({ db }, _, doneText) => ({
  db: Object.assign({}, db, {
    todos: db.todos.map(todo => todo.text === doneText
                                ? Object.assign({}, { done: true }, todo)
                                : todo),
  }),
}))

const EnterTodo = component("EnterTodo", db => db.newTodoText, (text) =>
  <div>
    <input
      value={text || ""}
      onChange={e => dispatch([SET_TODO_TEXT, e.target.value])}
    />
    <button onClick={() => dispatch([ADD_TODO])}>Add todo</button>
  </div>,
)

const App = component('App', createSub({
    todos: visibleTodos,
  }), ({ todos }) => (
    <div>
      <EnterTodo />

      <div style={{ display: "flex", flexDirecton: "column" }}>
        {todos.map(todo =>
          <div style={{ display: "flex" }}>
            {todo.done
             ? <strike>{todo.text}</strike>
             : <div>{todo.text}</div>}
            <button onClick={() => dispatch([MARK_DONE, todo.text])}>Mark done</button>
          </div>,
        )}
      </div>

      <FilterControls />

    </div>
  ),
)

const FilterControls = component("FilterControls", db => db.visibilityFilter,
  (visibilityFilter) =>
    <div>
      {[{ key: "done", text: "Show done", event: [CHANGE_FILTER, "done"] },
        { key: "not done", text: "Show not done", event: [CHANGE_FILTER, "not done"] },
        { key: "all", text: "Show all", event: [CHANGE_FILTER, "all"] }]
        .map(({ text, event, key }) =>
          <button
            style={{ color: visibilityFilter === key ? 'blue' : 'inherit' }}
            key={key}
            onClick={() => dispatch(event)}>
            {text}
          </button>,
        )}
    </div>,
)

export default App
