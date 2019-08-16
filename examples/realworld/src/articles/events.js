import * as R from 'ramda'
import { regResultFx } from '../api'
import { evt } from '../eventTypes'
import { fx } from '../fx'
import { regEventFx } from '../store'

regResultFx(
  evt.GET_ARTICLES,
  ({ db }, _, { articles, articlesCount }) => {
    return [fx.db(R.mergeLeft({ articles, articlesCount }))]
  },
  (_, __, err) => {
    console.error('error', err)
  })

regResultFx(evt.ARTICLE_FAVORITED,
  (_, __, res) => { console.log('favorited success', res) },
  (_, __, res) => { console.error('favorite failure', res) },
)

regEventFx(evt.SET_PAGE, ({ db }, _, n) => {
  // const {tag,author} = getArticleFilters(db)
  return [
    fx.dispatch(evt.API_REQUEST,[evt.SET_PAGE,])
  ]


})
