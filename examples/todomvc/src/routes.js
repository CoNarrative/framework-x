export const routeIds = {
  ALL_TODOS: 'all-todos',
  FILTERED_TODOS: 'filtered-todos',
}

export const routes = [
  { id: routeIds.ALL_TODOS, path: '/' },
  { id: routeIds.FILTERED_TODOS, path: '/:filter' }
]
