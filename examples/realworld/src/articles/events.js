import * as R from 'ramda'
import { regResultFx } from '../api'
import *  as api from '../api'
import { tabNames } from '../constants'
import { evt } from '../eventTypes'
import { fx } from '../fx'
import { regEventFx } from '../store'
import { getArticlesById } from './selectors'


regResultFx(evt.GET_ARTICLES,
  (_, __, { json: { articles, articlesCount } }) => ({
    db: R.mergeLeft({ articles, articlesCount })
  }), (_, __, err) => { console.error('error', err) })

regResultFx(evt.ARTICLE_FAVORITED, ({ db }, __, { json: { article } }) => ({
    db: R.assoc('articles', R.values(R.assoc(article.slug, article, getArticlesById(db))))
  }), (_, __, res) => { console.error('favorite failure', res) },
)

regEventFx(evt.CHANGE_TAB, (_, __, id) => {
  return [
    fx.db(R.pipe(
      R.assoc('articles', []),
      R.dissocPath(['articleFilters', 'tag']),
      R.assoc('selectedTab', id))),
    fx.dispatch(evt.API_REQUEST,
      [evt.GET_ARTICLES, id === tabNames.FEED ? api.articles.feed() : api.articles.all()]
    )
  ]
})

regEventFx(evt.UPDATE_ARTICLE_FILTERS, (_, __, filters) => {
  return [
    fx.db(R.assoc('articleFilters', filters)),
    fx.dispatch(evt.API_REQUEST, [evt.GET_ARTICLES, api.articles.matching(filters)])
  ]
})

regResultFx(evt.GET_ARTICLE,
  (_, __, { json: { article } }) => ({ db: R.assoc('article', article) }),
  (_, __, err) => { console.error('error', err) })

regResultFx(evt.GET_ARTICLE_TO_EDIT,
  (_, __, { json: { article } }) => ({ db: R.assocPath(['editor', 'form'], article) }),
  (_, __, err) => { console.error('error', err) })
