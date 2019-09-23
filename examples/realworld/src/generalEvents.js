import * as R from 'ramda'
import { evt } from './eventTypes'
import { dispatch, regEventFx } from './store'
import { parseJwt } from './util'


export const setKV = (ks, v) => dispatch(evt.SET_KV, [ks, v])

regEventFx(evt.SET_KV, (_, [ks, v]) => ({ db: R.assocPath(ks, v) }))

const setUserFromLocalStorage = (ls, setState) => {
  const token = ls.getItem('jwt')
  const user = parseJwt(token)
  let fns = []
  user && fns.push(R.assoc('user', user))
  token && fns.push(R.assoc('token', token))
  fns.length && setState(R.pipe(...fns))
}

export const initDb = (_, state) => ({
  db: state,
  localStorage: setUserFromLocalStorage
})

regEventFx(evt.INITIALIZE_DB, initDb)
