import { derive } from 'framework-x'
import * as R from 'ramda'
import { visibilityFilter } from '../constants'
import { getRouteParams } from '../routes/selectors'

export const getAllTodos = R.path(['todos'])

export const getDoneTodos = derive([getAllTodos], R.filter(R.prop('done')))

export const getNotDoneTodos = derive([getAllTodos], R.reject(R.prop('done')))

export const getTodosByText = derive([getAllTodos], R.indexBy(R.prop('text')))

export const getNewTodoText = R.path(['newTodoText'])

export const getVisibilityFilter = derive([getRouteParams], R.propOr(visibilityFilter.ALL, 'filter'))

export const getVisibleTodos = derive(
  [getVisibilityFilter, getAllTodos, getDoneTodos, getNotDoneTodos],
  (filter, all, done, notDone) => {
    switch (filter) {
      case visibilityFilter.DONE:
        return done
      case visibilityFilter.NOT_DONE:
        return notDone
      case visibilityFilter.ALL:
        return all
      default:
        console.error('unhandled visibility filter', filter)
        return all
    }
  }
)

export const getDoneCount = derive([getDoneTodos], R.length)
export const getNotDoneCount = derive([getNotDoneTodos], R.length)
export const getAllTodosCount = derive([getAllTodos], R.length)
