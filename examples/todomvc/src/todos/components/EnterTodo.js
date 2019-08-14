import { component, createSub } from 'framework-x'
import React from 'react'
import { evt } from '../../eventTypes'
import { dispatch } from '../../store'
import { getNewTodoText } from '../selectors'

export const EnterTodo = component('EnterTodo',
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
