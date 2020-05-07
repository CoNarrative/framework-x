import type { Route } from "framework-x"

export const routeIds = {
  ALL_TODOS: 'all-todos',
  FILTERED_TODOS: 'filtered-todos',
} as const

export const routes: ReadonlyArray<Route> = [
  { id: routeIds.ALL_TODOS, path: '/' },
  { id: routeIds.FILTERED_TODOS, path: '/:filter' }
] as const
