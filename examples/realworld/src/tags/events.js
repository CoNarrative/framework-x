import *  as R from 'ramda'
import * as api from '../api'
import { evt } from '../eventTypes'
import { fx } from '../fx'
import { regEventFx } from '../store'


api.regResultFx(evt.GET_TAGS,
  (_, __, { json: { tags } }) => {
    return { db: R.mergeLeft({ tags }) }
  }, (_, __, res) => {
    console.log('error getting tags', res)
  })

regEventFx(evt.APPLY_TAG_FILTER, ({ db }, __, tag) => {
  return [
    fx.dispatch(evt.API_REQUEST, [evt.APPLY_TAG_FILTER, api.articles.byTag(tag, 0)]),
  ]
})

api.regResultFx(evt.APPLY_TAG_FILTER,
  (_, __, { json: { articles } }) => {
    return [fx.db(R.mergeLeft({ articles }))]
  }, (_, __, e) => {
    console.error('error applying tags', e)
  })
