import * as R from 'ramda'
import { regResultFx } from '../api'
import { evt } from '../eventTypes'


regResultFx(evt.GET_USER,
  ({ db }, _, { json: { user } }) => ({ db: R.assoc('user', user) }),
  (_, __, err) => { console.error('error getting user', err) })
