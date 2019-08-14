export const routeIds = {
  ALL_TODOS: 'all-todos',
  DONE_TODOS: 'done-todos',
  TO_DO_TODOS: 'to-do-todos'
}

export const routes = [
  { id: routeIds.ALL_TODOS, path: '/' },
  { id: routeIds.DONE_TODOS, path: '/done' },
  { id: routeIds.TO_DO_TODOS, path: '/todo' }
]
