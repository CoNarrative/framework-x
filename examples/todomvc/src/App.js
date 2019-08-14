import React from 'react'
import { EnterTodo } from './todos/components/EnterTodo'
import { TodosList } from './todos/components/TodosList'
import { VisibilityFilters } from './todos/components/VisibilityFilters'


export const App = () => (
  <div style={{ height: '100vh' }}>
    <EnterTodo />
    <TodosList />
    <VisibilityFilters />
  </div>
)
