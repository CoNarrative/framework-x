import * as R from 'ramda'
import { regResultFx } from '../api'
import * as api from '../api'
import { evt } from '../eventTypes'
import { fx } from '../fx'
import { routeIds } from '../routes'
import { getRouteId, getRouteParams } from '../routes/selectors'
import { regEventFx } from '../store'
import { getEditorForm } from './selectors'

regEventFx(evt.USER_REQUESTS_SAVE_STORY, ({ db }) => {
  const story = getEditorForm(db)
  const isEdit = getRouteId(db) === routeIds.EDIT_STORY
  const params = getRouteParams(db)
  const req = [evt.SAVE_STORY, isEdit
                               ? api.articles.update(R.assoc('slug', params.id, story))
                               : api.articles.create(story)]
  return [
    fx.dispatch(evt.API_REQUEST, req)
  ]
})

regResultFx(evt.SAVE_STORY, (_, __, { json: { article } }) => {
  const { slug: id } = article
  return [
    fx.db(R.pipe(
      R.dissoc('editor'),
      R.assoc('article', article)
      )
    ),
    fx.dispatch(evt.NAV_TO, [routeIds.ARTICLE, { id }]),
    fx.dispatch(evt.API_REQUEST, [evt.GET_COMMENTS, api.comments.forArticle(id)])
  ]
}, (_, __, { json: { errors } }) => {
  return {
    db: R.pipe(R.dissocPath(['editor', 'isLoading']),
      R.assocPath(['editor', 'errors'], errors)
    )
  }
})
