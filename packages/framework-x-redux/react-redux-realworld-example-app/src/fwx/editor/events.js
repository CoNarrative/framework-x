import {
  EDITOR_PAGE_LOADED,
  EDITOR_PAGE_UNLOADED,
  ARTICLE_SUBMITTED,
  ASYNC_START,
  ADD_TAG,
  REMOVE_TAG,
  UPDATE_FIELD_EDITOR
} from '../../constants/actionTypes'
import * as R from 'ramda'
import { regEventFx } from '../store'

export const updateIn = R.curry((ks, f, m) => R.assocPath(ks, f(R.path(ks, m)), m))

const defaultLoaded = {
  articleSlug: '',
  title: '',
  description: '',
  body: '',
  tagInput: '',
  tagList: []
}

regEventFx(EDITOR_PAGE_LOADED, (_, { payload: { article } }) =>
  [['db', R.assoc('editor', R.merge(defaultLoaded, article))]])

regEventFx(EDITOR_PAGE_UNLOADED, () => [['db', R.assoc('editor', {})]])

regEventFx(ARTICLE_SUBMITTED, (_, { error, payload }) => [
  ['db', updateIn(['editor'],
    R.mergeLeft({ inProgress: null, errors: error ? payload.errors : null }))
  ]
])

regEventFx(ASYNC_START, (_, { subtype }) => {
  if (subtype === ARTICLE_SUBMITTED) {
    return [['db', R.assocPath(['editor', 'inProgress'], true)]]
  }
})

regEventFx(ADD_TAG, ({ db }) => [
  ['db', updateIn(['editor', 'tagList'], R.append(R.path(['editor', 'tagInput'], db)))],
  ['db', R.assocPath(['editor', 'tagInput'], '')]
])

regEventFx(REMOVE_TAG, ({ db }, { tag }) =>
  [['db', updateIn(['editor', 'tagList'], R.reject(R.equals(tag)))]])

regEventFx(UPDATE_FIELD_EDITOR, ({ db }, { key, value }) =>
  [['db', R.assocPath(['editor', key], value)]])

