import { derive } from 'framework-x'
import * as R from 'ramda'
import { visibilityFilter } from '../constants'

export const getVisibilityFilter = R.path(['visibilityFilter'])

export const getAllTodos = R.path(['todos'])

export const getNewTodoText = R.path(['newTodoText'])

export const getVisibleTodos = derive(
  [getVisibilityFilter, getAllTodos],
  (filter, todos) => {
    switch (filter) {
      case visibilityFilter.DONE:
        return R.filter(R.prop('done'), todos)
      case visibilityFilter.NOT_DONE:
        return R.reject(R.prop('done'), todos)
      case visibilityFilter.ALL:
        return todos
      default:
        console.error('unhandled visibility filter', filter)
        return todos
    }
  }
)
