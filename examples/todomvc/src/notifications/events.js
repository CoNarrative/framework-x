import * as R from 'ramda'
import { evt } from '../eventTypes'
import { fx } from '../fx'
import { dispatch, regEventFx } from '../store'

regEventFx(evt.SHOW_NOTIFICATION, ({ db }, _, { id, type, message, duration = 3500 }) => {
  const timeout = duration
                  ? setTimeout(() => dispatch(evt.HIDE_NOTIFICATION, { id }), duration)
                  : null

  return {
    db: R.assocPath(['notifications', id], { id, type, message, timeout })
  }
})

regEventFx(evt.HIDE_NOTIFICATION, ({ db }, _, { id }) => {
  const alert = R.path(['notifications', id], db)

  if (!alert) {
    return
  }

  clearTimeout(alert.timeout)

  return [
    fx.db(R.dissocPath(['notifications', id]))
  ]
})


const makeGetSet = (path,defaultValue=null)=>
  R.juxt([
    R.pathOr(defaultValue,path),
    R.assocPath(path)
  ])
