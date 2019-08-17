import * as R from 'ramda'
import { regResultFx } from '../api'
import *  as api from '../api'
import { tabNames } from '../constants'
import { evt } from '../eventTypes'
import { fx } from '../fx'
import { regEventFx } from '../store'

regResultFx(
  evt.GET_ARTICLES,
  ({ db }, _, { json: { articles, articlesCount } }) => {
    return [fx.db(R.mergeLeft({ articles, articlesCount }))]
  },
  (_, __, err) => {
    console.error('error', err)
  })

regResultFx(evt.ARTICLE_FAVORITED,
  (_, __, res) => { console.log('favorited success', res) },
  (_, __, res) => { console.error('favorite failure', res) },
)

regEventFx(evt.CHANGE_TAB, ({ db }, _, id) => {
  return [
    fx.db(R.pipe(
      R.assoc('articles', []),
      R.assoc('selectedTab', id))),
    fx.dispatch(evt.API_REQUEST,
      [evt.GET_ARTICLES, id === tabNames.FEED ? api.articles.feed() : api.articles.all()]
    )
  ]
})

regEventFx(evt.UPDATE_ARTICLE_FILTERS, ({ db }, _, filters) => {
  return [
    fx.db(R.assoc('articleFilters', filters)),
    fx.dispatch(evt.API_REQUEST, [evt.GET_ARTICLES, api.articles.matching(filters)
    ])
  ]
})
