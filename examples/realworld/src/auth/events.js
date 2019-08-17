import * as R from 'ramda'
import { regResultFx } from '../api'
import { evt } from '../eventTypes'
import { routeIds } from '../routes'
import { dispatch, regEventFx } from '../store'
import { fx } from '../fx'
import * as api from '../api'
import { setToken, unsetToken } from './selectors'

export const changeAuthKey = k => e => dispatch(evt.SET_KV, [['auth', k], e.target.value])

regEventFx(evt.USER_REQUESTS_LOGIN, (_, __, { email, password }) => {
  return [
    fx.db(R.pipe(
      R.assocPath(['auth', 'isLoading'], true),
      R.dissocPath(['auth', 'errors']))),
    fx.dispatch(evt.API_REQUEST, [evt.LOGIN_REQUEST, api.auth.login(email, password)])
  ]
})

regResultFx(evt.LOGIN_REQUEST, ({ db }, _, res) => {
  const { user } = res.json
  setToken(user.token)
  return [
    fx.db(R.pipe(
      R.dissocPath(['auth', 'isLoading']),
      R.assoc('user', user))),
    fx.dispatch(evt.NAV_TO, [routeIds.HOME])
  ]
}, ({ db }, _, res) => {
  console.error('login error', res)
  return [fx.db(R.pipe(
    R.dissocPath(['auth', 'isLoading']),
    R.assocPath(['auth', 'errors'], res.json.errors)))]
})

regEventFx(evt.USER_REQUESTS_REGISTER, (_, __, { username, email, password }) => {
  return [
    fx.db(R.pipe(
      R.assocPath(['auth', 'isLoading'], true),
      R.dissocPath(['auth', 'errors']))),
    fx.dispatch(evt.API_REQUEST, [evt.REGISTER_REQUEST, api.auth.register(username, email, password)])
  ]
})

regResultFx(evt.REGISTER_REQUEST, ({ db }, _, res) => {
  const { user } = res.json
  setToken(user.token)
  return [fx.db(R.pipe(
    R.dissocPath(['auth', 'isLoading']),
    R.assoc('user', user)
  )),
    fx.dispatch(evt.NAV_TO, [routeIds.HOME])]
}, ({ db }, _, res) => {
  console.error('register error', res)
  return [fx.db(R.pipe(
    R.dissocPath(['auth', 'isLoading']),
    R.assocPath(['auth', 'errors'], res.json.errors)))]
})

regEventFx(evt.USER_REQUESTS_LOGOUT, () => {
  unsetToken()
  return [fx.db(R.dissoc('user')), fx.dispatch(evt.NAV_TO, [routeIds.HOME])]
})
