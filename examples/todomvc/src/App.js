import React from 'react'
import { Notifications } from './notifications/components/Notification'
import { Controls } from './todos/components/Controls'
import { EnterTodo } from './todos/components/EnterTodo'
import { TodosList } from './todos/components/TodosList'
import { VisibilityFilters } from './todos/components/VisibilityFilters'


export const App = () => (
  <div style={{ height: '100vh' }}>
    <EnterTodo />
    <TodosList />
    <VisibilityFilters />
    <Controls/>
    <Notifications />
  </div>
)
