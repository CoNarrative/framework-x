import * as R from 'ramda'
import { regResultFx } from '../api'
import { evt } from '../eventTypes'
import { fx } from '../fx'
import { routeIds } from '../routes'
import { getRouteParams } from '../routes/selectors'
import { regEventFx } from '../store'
import * as api from '../api'
import { updateIn } from '../util'
import { getCommentForm } from './selectors'

regResultFx(evt.GET_COMMENTS,
  (_, __, { json: { comments } }) => {
    return { db: R.assoc('comments', comments) }
  }, (_, __, err) => {
    console.error('error getting comments', err)
  })

regEventFx(evt.USER_REQUESTS_POST_COMMENT, ({ db }) => {
  const comment = getCommentForm(db)
  const { id } = getRouteParams(db)
  return [fx.dispatch(evt.API_REQUEST, [evt.POST_COMMENT, api.comments.create(id, comment)])]
})

regResultFx(evt.POST_COMMENT,
  (_, __, { json: { comment } }) => {
    return [fx.db(R.pipe(R.dissoc('comment'),
      updateIn(['comments'], (comments = []) => R.append(comment, comments)))
    )]
  }, (_, __, err) => {
    console.error('comment error', err)
  })

regEventFx(evt.USER_REQUESTS_DELETE_COMMENT, ({ db }, _, { id, slug }) => {
  return [fx.dispatch(evt.API_REQUEST,
    [evt.DELETE_COMMENT, api.comments.delete(slug, id), { id, slug }])]
})

regResultFx(evt.DELETE_COMMENT,
  (_, __, { args: { id } }) => {
    return [fx.db(
      updateIn(['comments'], (comments = []) => R.reject(R.propEq('id', id), comments))
    )]
  }, (_, __, err) => {
    console.error('comment error', err)
  })


regResultFx(evt.DELETE_ARTICLE, () => {
  return [
    fx.db(R.pipe(R.dissoc('article'), R.dissoc('comments'))),
    fx.dispatch(evt.NAV_TO, [routeIds.HOME])
  ]
}, (_, __, err) => {
  console.error('comment error', err)
})
