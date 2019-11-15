import * as R from 'ramda'
import { regResultFx } from '../api'
import { evt } from '../eventTypes'


regResultFx(evt.GET_USER,
  ({ db }, { json: { user } }) => ({ db: R.assoc('user', user) }),
  (_, err) => { console.error('error getting user', err) })
