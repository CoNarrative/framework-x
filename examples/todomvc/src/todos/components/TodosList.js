import { component, createSub } from 'framework-x'
import React from 'react'
import { evt } from '../../eventTypes'
import { dispatch } from '../../store'
import { getVisibleTodos } from '../selectors'

export const TodosList = component('TodosList',
  createSub({
    todos: getVisibleTodos
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
