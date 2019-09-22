import * as R from 'ramda'
import { evt } from './eventTypes'
import { dispatch, regEventFx } from './store'


export const setKV = (ks, v) => dispatch(evt.SET_KV, [ks, v])

regEventFx(evt.SET_KV, (_, [ks, v]) => ({ db: R.assocPath(ks, v) }))
