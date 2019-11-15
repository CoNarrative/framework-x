import * as R from 'ramda'
import { regResultFx } from '../api'
import { evt } from '../eventTypes'
import { fx } from '../fx'
import { routeIds } from '../routes'
import { regEventFx } from '../store'
import { updateIn } from '../util'
import { getProfileForm } from './selectors'
import * as api from '../api'


regResultFx(evt.GET_PROFILE, (_, { json: { profile } }) => {
  return [fx.db(R.assoc('profile', updateIn(['bio'], x => x ? x : '', profile)))]
}, (_, err) => { console.error('error getting profile', err) })


regEventFx(evt.USER_REQUESTS_SAVE_PROFILE, ({ db }) => {
  const profile = getProfileForm(db)
  return [fx.dispatch(evt.API_REQUEST, [evt.UPDATE_PROFILE, api.profile.save(profile)])]
})

regResultFx(evt.UPDATE_PROFILE,
  () => [fx.db(R.dissoc('profile')), fx.dispatch(evt.NAV_TO, [routeIds.HOME])],
  (_, err) => { console.error('error updating profile', err) })

regEventFx(evt.USER_REQUESTS_TOGGLE_FOLLOWING, (_, [username, follow]) => {
  return [fx.dispatch(evt.API_REQUEST,
    [evt.TOGGLE_FOLLOW_USER, api.profile[follow ? 'follow' : 'unfollow'](username)])]
})

regResultFx(evt.TOGGLE_FOLLOW_USER,
  (_, { json: { profile } }) => ({ db: R.assoc('profile', profile) }),
  (_, err) => { console.log('follow toggle failure', err) })
