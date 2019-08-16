import * as R from 'ramda'
import { evt } from './eventTypes'
import { fx } from './fx'
import { regEventFx } from './store'


regEventFx(evt.SET_KV, (_, __, [ks, v]) => {
  return [fx.db( R.assocPath(ks, v))]
})
