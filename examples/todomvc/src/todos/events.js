import * as R from 'ramda'
import { visibilityFilter } from '../constants'
import { evt } from '../eventTypes'
import { fx } from '../fx'
import { routeIds } from '../routes'
import { getAllTodos, getNewTodoText, getTodosByText } from './selectors'
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

regEventFx(evt.ADD_TODO, ({ db }) => {
  return [
    fx.db(updateIn(['todos'], R.append({ text: getNewTodoText(db), done: false }))),
    fx.dispatch(evt.SET_TODO_TEXT, ''),
    fx.dispatch(evt.SHOW_NOTIFICATION, {
      id: 'todo-added-' + Date.now().toString(),
      type: 'success',
      message: 'Todo added.',
      duration: 5000
    })
  ]
})

regEventFx(evt.TOGGLE_DONE, ({ db }, doneText) => {
  return [
    fx.db(updateIn(['todos'],
      R.map(todo =>
        todo.text === doneText
        ? updateIn(['done'], R.not, todo)
        : todo)
    )),
    fx.dispatch(evt.TODO_STATUS_CHANGED, doneText)
  ]
})

regEventFx(evt.MARK_ALL_DONE, ({ db }) => {
  const todos = getAllTodos(db)
  return [
    fx.db(updateIn(['todos'], R.map(R.assoc('done', true)))),
    ...todos.map(({ text }) => fx.dispatch(evt.TODO_STATUS_CHANGED, text))
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
    fx.dispatch(evt.SHOW_NOTIFICATION, {
      type: 'success',
      message: `Removing ${n} ${R.all(R.prop('done'), toRemove)
                                ? 'completed'
                                : ''} todo${n === 1 ? '' : 's'}`
    })
  ]
})

regEventFx(evt.TODOS_REMOVED, (_, removed) => {
  const n = removed.length
  return [
    fx.dispatch(evt.SHOW_NOTIFICATION, {
      type: 'success',
      message: `${n} ${R.all(R.prop('done'), removed)
                       ? 'completed'
                       : ''} todo${n === 1 ? '' : 's'} was removed.`
    })
  ]
})

regEventFx(evt.TODO_STATUS_CHANGED, ({ db }, todoText) => {
  const isDone = R.path([todoText, 'done'], getTodosByText(db))
  return [
    fx.dispatch(evt.SHOW_NOTIFICATION,
      R.zipObj(['id', 'message', 'duration'],
        isDone ? ['todo-done-' + Date.now().toString(), 'Great job!', 3000]
               : ['todo-undone' + Date.now().toString(), 'Todo not done', 3000]
      )
    )
  ]
})
