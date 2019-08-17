import * as R from 'ramda'
import { regResultFx } from '../api'
import { evt } from '../eventTypes'
import { fx } from '../fx'

regResultFx(evt.GET_USER,
  ({ db }, _, { json: { user } }) => {
    return [fx.db(R.assoc('user', user))]
  }, (_, __, err) => {
    console.error('error getting user', err)
  })
