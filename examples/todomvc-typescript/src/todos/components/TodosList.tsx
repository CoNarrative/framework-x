import { component, createSub, derive } from 'framework-x'
import React from 'react'
import * as R from 'ramda'
import { evt } from '../../eventTypes'
import { getEditTodo, getNewTodoText, getVisibleTodos } from '../selectors'
import { ulid } from 'ulid'


export const NewTodoTextInput = component('NewTodoTextInput',
  createSub({ text: getNewTodoText }),
  ({ dispatch, text }) =>
    <input
      className={'new-todo'}
      type="text"
      placeholder={'What needs to be done?'}
      autoFocus={true}
      value={text}
      onChange={(e) => dispatch(evt.SET_TODO_TEXT, e.target.value)}
      onKeyDown={e => {
        if (e.which === 13) {
          dispatch(evt.ADD_TODO, { id: ulid(), text, done: false })
        }
      }} />
)
const EditTodoTextInput = component('TodoTextInput',
  createSub({ text: derive([getEditTodo], R.path(['text'])) }),
  ({ dispatch, text }) =>
    <input
      className={'edit'}
      type="text"
      autoFocus={true}
      value={text}
      onKeyDown={e => {
        if (e.which === 13) {
          dispatch(evt.SAVE_EDIT_TODO)
        }
      }}
      onBlur={() => dispatch(evt.SAVE_EDIT_TODO)}
      onChange={(e) => dispatch(evt.SET_EDIT_TODO_TEXT, e.target.value)}
    />
)

const TodoItem = component('TodoListItem',
  { injectDispatch: true },
  ({ dispatch, id, done, text }) =>
    <div className="view">
      <input
        className="toggle"
        type="checkbox"
        checked={done}
        onChange={() => dispatch(evt.TOGGLE_DONE, id)} />
      <label
        onDoubleClick={() => dispatch(evt.START_EDIT_TODO, id)}>
        {text}
      </label>
      <button
        className="destroy"
        onClick={() => dispatch(evt.REMOVE_TODO, id)} />
    </div>
)

export const VisibleTodosList = component('VisibleTodosList',
  createSub({ todos: getVisibleTodos, editTodo: getEditTodo }),
  ({ todos, editTodo }) =>
    <ul className="todo-list">
      {todos.map(({ id, text, done }, i) => {
          const isEditing = editTodo && id === editTodo.id
          return (
            <li key={i} className={isEditing ? 'editing' : undefined}>
              {isEditing
               ? <EditTodoTextInput />
               : <TodoItem {...{ id, text, done}} />}
            </li>
          )
        }
      )}
    </ul>
)
