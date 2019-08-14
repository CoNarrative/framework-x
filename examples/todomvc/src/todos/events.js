import * as R from 'ramda'
import { visibilityFilter } from '../constants'
import { evt } from '../eventTypes'
import { fx } from '../fx'
import { routeIds } from '../routes'
import { getNewTodoText } from './selectors'
import { regEventFx } from '../store'
import { updateIn } from '../util'


regEventFx(evt.INITIALIZE_DB, (_, __, state = {}) => {
    return [
      fx.db(state)
    ]
  }
)

regEventFx(evt.SET_TODO_TEXT, (_, __, value) => {
    return [
      fx.db(R.assoc('newTodoText', value))
    ]
  }
)

regEventFx(evt.CHANGE_FILTER, ({ db }, _, value) => {
  return [
    fx.db(R.assoc('visibilityFilter', value)),
    fx.dispatch(evt.NAV_TO, [routeIds.DONE_TODOS])
  ]
})

regEventFx(evt.ADD_TODO, ({ db }) => {
  return [
    fx.db(updateIn(['todos'], R.append({ text: getNewTodoText(db), done: false }))),
    fx.dispatch(evt.SET_TODO_TEXT, ''),
    fx.dispatch(evt.SHOW_NOTIFICATION, { id: 'todo-done' })
  ]
})

regEventFx(evt.TOGGLE_DONE, ({ db }, _, doneText) => {
  return [
    fx.db(updateIn(['todos'],
      R.map(todo =>
        todo.text === doneText
        ? updateIn(['done'], R.not, todo)
        : todo)
      )
    )
  ]
})
