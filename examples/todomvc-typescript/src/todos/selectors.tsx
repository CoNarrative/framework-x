import { derive } from 'framework-x'
import * as R from 'ramda'
import { VisibilityFilter, visibilityFilter } from '../constants'
import { getRouteParams } from '../routes/selectors'
import { Selector, Todo } from "../types"
import { createSelector } from "reselect"

const derive = createSelector


export const getAllTodos: Selector<Todo[]> =
  R.pipe(R.prop('todos'), R.sortBy(R.prop('id')))

export const getDoneTodos: Selector<Todo[]> =
  derive([getAllTodos], R.filter(R.propOr(undefined, 'done')))

export const getNotDoneTodos: Selector<Todo[]> =
  derive([getAllTodos],
    R.reject(R.compose(Boolean, R.propOr(null, 'done'))))

export const getTodosById = derive([getAllTodos], R.indexBy(R.prop('id')))

export const getEditTodo: Selector<Todo> = R.path(['editTodo'])

export const getNewTodoText = R.pathOr('', ['newTodoText'])

export const getVisibilityFilter: Selector<VisibilityFilter> =
  createSelector([getRouteParams], R.propOr(visibilityFilter.ALL, 'filter'))

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
