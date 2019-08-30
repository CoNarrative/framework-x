import * as R from 'ramda'
import { evt } from '../eventTypes'
import { dispatch, regEventFx } from '../store'
import { updateIn } from '../util'
import { getNotificationsMap } from './selectors'


regEventFx(evt.SHOW_NOTIFICATION, ({ db }, _, { id, type, message, duration = 900 }) => {
  const timeout = duration
                  ? setTimeout(() => dispatch(evt.HIDE_NOTIFICATION, { id }), duration)
                  : null

  return {
    db: updateIn(['notifications'], R.append({
      id,
      type,
      message,
      timeout
    }))
  }
})

regEventFx(evt.HIDE_NOTIFICATION, ({ db }, _, { id }) => {
  const notification = R.prop(id, getNotificationsMap(db))

  if (!notification) {
    return
  }

  clearTimeout(notification.timeout)

  return {
    db: updateIn(['notifications'], R.reject(R.propEq('id', id)))
  }
})
