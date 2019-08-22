import * as queryString from 'query-string'
import * as R from 'ramda'
import { getToken } from './auth/selectors'
import { ARTICLES_PER_PAGE } from './constants'
import { fx } from './fx'
import { regEventFx } from './store'
import { evt } from './eventTypes'

const API_ROOT = 'https://conduit.productionready.io/api'

export const apiRequest = (method, endpoint, body) => {
  const base = { method, url: `${API_ROOT}${endpoint}` }
  return body ? R.merge({
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' }
  }, base) : base
}

export const success = eventName => `${eventName}-success`
export const failure = eventName => `${eventName}-failure`

export const regResultFx = (eventName, successBranch, failureBranch,
  successEventName = success(eventName), failureEventName = failure(eventName)) => {
  regEventFx(successEventName, successBranch)
  regEventFx(failureEventName, failureBranch)
}

regEventFx(evt.API_REQUEST, (_, __, foo) => {
  const [eventName, [method, endpoint, body], args] = foo
  const token = getToken()
  const req = apiRequest(method, endpoint, body)
  return [
    fx.fetch(token ? R.assocPath(['headers', 'authorization'], ` Token ${token}`, req) : req,
      args ? [success(eventName), args] : success(eventName),
      args ? [failure(eventName), args] : failure(eventName)
    )
  ]
})

export const auth = {
  current: () => ['GET', '/user'],
  login: (email, password) => ['POST', '/users/login', { user: { email, password } }],
  register: (username, email, password) => ['POST', '/users', { user: { username, email, password } }],
}

export const tags = { getAll: () => ['GET', '/tags'] }

const offset = (limit, page) => page ? page * limit : 0

const limitAndOffset = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`;
const articleQuery = ({ page, tag, author, limit = ARTICLES_PER_PAGE }) =>
  '?' + queryString.stringify(R.merge({ author, page, tag, limit, }, offset(limit, page)))

export const articles = {
  matching: ({ page, tag, author, limit }) => ['GET', '/articles' + articleQuery({ page, tag, author, limit })],
  all: page => ['GET', `/articles?${offset(ARTICLES_PER_PAGE, page)}`],
  byAuthor: (author, page) => ['GET', `/articles?author=${encodeURIComponent(author)}&${limitAndOffset(5, page)}`],
  byTag: (tag, page) => ['GET', `/articles?tag=${encodeURIComponent(tag)}&${limitAndOffset(10, page)}`],
  del: slug => ['DELETE', `/articles/${slug}`],
  favorite: slug => ['POST', `/articles/${slug}/favorite`],
  favoritedBy: (author, page) => ['GET', `/articles?favorited=${encodeURIComponent(author)}&${limitAndOffset(5, page)}`],
  feed: () => ['GET', '/articles/feed?limit=10&offset=0'],
  get: slug => ['GET', `/articles/${slug}`],
  unfavorite: slug => ['DELETE', `/articles/${slug}/favorite`],
  update: article => ['PUT', `/articles/${article.slug}`, { article: R.dissoc('slug', article) }],
  create: article => ['POST', '/articles', { article }]
}

export const comments = {
  create: (slug, comment) => ['POST', `/articles/${slug}/comments`, { comment }],
  delete: (slug, commentId) => ['DELETE', `/articles/${slug}/comments/${commentId}`],
  forArticle: slug => ['GET', `/articles/${slug}/comments`]
}

export const profile = {
  follow: username => ['POST', `/profiles/${username}/follow`],
  get: username => ['GET', `/profiles/${username}`],
  unfollow: username => ['DELETE', `/profiles/${username}/follow`],
  save: user => ['PUT', '/user', { user }]
}
