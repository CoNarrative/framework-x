export const visibilityFilter = {
  ALL: 'all',
  DONE: 'done',
  NOT_DONE: 'not-done'
} as const

export type VisibilityFilter = typeof visibilityFilter[keyof typeof visibilityFilter]
