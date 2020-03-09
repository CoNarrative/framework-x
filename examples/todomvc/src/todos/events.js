import * as R from 'ramda'
import { visibilityFilter } from '../constants'
import { evt } from '../eventTypes'
import { fx } from '../fx'
import { routeIds } from '../routes'
import { getAllTodos, getEditTodo, getTodosById, } from './selectors'
import { regEventFx } from '../store'
import { updateIn } from '../util'


regEventFx(evt.INITIALIZE_DB, (_, state = {}) => {
  return {
    db: state
  }
})

regEventFx(evt.SET_TODO_TEXT, (_, value) => {
  return {
    db: R.assoc('newTodoText', value)
  }
})

const routeForFilter = (filterName) => {
  switch (filterName) {
    case visibilityFilter.DONE:
      return [routeIds.FILTERED_TODOS, { filter: visibilityFilter.DONE }]

    case visibilityFilter.NOT_DONE:
      return [routeIds.FILTERED_TODOS, { filter: visibilityFilter.NOT_DONE }]

    case visibilityFilter.ALL:
      return [routeIds.ALL_TODOS]

    default:
      console.error('unhandled filter', filterName)
      return [routeIds.ALL_TODOS]
  }
}

regEventFx(evt.CHANGE_FILTER, ({ db }, value) => {
  const route = routeForFilter(value)
  return [
    fx.dispatch(evt.NAV_TO, route)
  ]
})

regEventFx(evt.ADD_TODO, ({ db }, { id, text, done = false }) => {
  return [
    fx.db(updateIn(['todos'], R.append({ id, text, done }))),
    fx.dispatch(evt.SET_TODO_TEXT, ''),
    fx.notification({
      type: 'success',
      message: 'Todo added.',
      duration: 2000
    })
  ]
})
regEventFx(evt.REMOVE_TODO, ({ db }, id) => {
  return [
    fx.db(updateIn(['todos'], R.reject(x => x.id === id))),
    fx.notification({
      type: 'success',
      message: 'Todo removed.',
      duration: 2500
    })
  ]
})

regEventFx(evt.START_EDIT_TODO, ({ db }, id) => {
  return [
    fx.db(R.assoc('editTodo', R.path([id], getTodosById(db)))),
    fx.notification({
      type: 'success',
      message: 'Editing.',
      duration: 2500
    })
  ]
})

regEventFx(evt.SET_EDIT_TODO_TEXT, ({ db }, text) => {
  return [
    fx.db(R.assocPath(['editTodo', 'text'], text)),
  ]
})

regEventFx(evt.SAVE_EDIT_TODO, ({ db }, _) => {
  const edited = getEditTodo(db)
  const todosById = getTodosById(db)

  return [
    fx.db(R.assoc('todos', R.values(R.assoc(edited.id, edited, todosById)))),
    fx.db(R.dissoc('editTodo')),
    fx.notification({
      type: 'success',
      message: 'Edit saved.',
      duration: 2500
    })
  ]
})


regEventFx(evt.TOGGLE_DONE, ({ db }, id) => {
  return [
    fx.db(updateIn(['todos'],
      R.map(todo =>
        todo.id === id
        ? updateIn(['done'], R.not, todo)
        : todo)
    )),
    fx.dispatch(evt.TODO_STATUS_CHANGED, id)
  ]
})

regEventFx(evt.MARK_ALL_DONE, ({ db }) => {
  const todos = getAllTodos(db)
  return [
    fx.db(updateIn(['todos'], R.map(R.assoc('done', true)))),
    ...todos.map(({ id }) => fx.dispatch(evt.TODO_STATUS_CHANGED, id))
  ]
})

regEventFx(evt.CLEAR_ALL, () => {
  return [
    fx.db(R.assoc('todos', []))
  ]
})
regEventFx(evt.CLEAR_ALL_DONE, ({ db }) => {
  const todos = getAllTodos(db)
  const [done, notDone] = R.partition(R.prop('done'), todos)
  return [
    fx.dispatch(evt.BEGIN_REMOVE_TODOS, done),
    fx.db(R.assoc('todos', notDone)),
    fx.dispatch(evt.TODOS_REMOVED, done)
  ]
})

regEventFx(evt.BEGIN_REMOVE_TODOS, (_, toRemove) => {
  const n = toRemove.length
  return [
    fx.notification({
      type: 'success',
      message: `Removing ${n} ${R.all(R.prop('done'), toRemove)
                                ? 'completed'
                                : ''} todo${n === 1 ? '' : 's'}`,
      duration: 2500
    })
  ]
})

regEventFx(evt.TODOS_REMOVED, (_, removed) => {
  const n = removed.length
  return [
    fx.notification({
      type: 'success',
      message: `${n} ${R.all(R.prop('done'), removed)
                       ? 'completed'
                       : ''} todo${n === 1 ? ' was' : 's were'}  removed.`,
      duration: 2500
    })
  ]
})

regEventFx(evt.TODO_STATUS_CHANGED, ({ db }, id) => {
  const isDone = R.path([id, 'done'], getTodosById(db))
  return [
    fx.notification(
      R.zipObj(['type', 'message', 'duration'],
        isDone ? ['success', 'Great job!', 2500]
               : ['success', 'Todo not done', 2500]
      )
    )
  ]
})
