import *  as R from 'ramda'
import * as api from '../api'
import { tabNames } from '../constants'
import { evt } from '../eventTypes'
import { fx } from '../fx'
import { regEventFx } from '../store'


api.regResultFx(evt.GET_TAGS,
  (_, { json: { tags } }) => ({ db: R.mergeLeft({ tags }) }),
  (_, res) => { console.log('error getting tags', res) })

regEventFx(evt.APPLY_TAG_FILTER, ({ db }, tag) => [
  fx.dispatch(evt.API_REQUEST, [evt.APPLY_TAG_FILTER, api.articles.byTag(tag, 0), { tag }]),
])

api.regResultFx(evt.APPLY_TAG_FILTER,
  (_, { res: { json: { articles } }, args: { tag } }) => ({
    db: R.pipe(R.assoc('articles', articles),
      R.assoc('selectedTab', tabNames.TAG),
      R.assocPath(['articleFilters', 'tag'], tag))
  }), (_, e) => { console.error('error applying tags', e) })
