import * as R from 'ramda'
import { getToken } from './auth/selectors'
import { fx } from './fx'
import { regEventFx } from './store'
import { evt } from './eventTypes'

const API_ROOT = 'https://conduit.productionready.io/api'

export const apiRequest = (method, endpoint, body) => ({
  method,
  url: `${API_ROOT}${endpoint}`,
  ...body,
})

export const success = eventName => `${eventName}-success`
export const failure = eventName => `${eventName}-failure`

export const regResultFx = (eventName, successBranch, failureBranch,
  successEventName = success(eventName), failureEventName = failure(eventName)) => {
  regEventFx(successEventName, successBranch)
  regEventFx(failureEventName, failureBranch)
}

regEventFx(evt.API_REQUEST, (_, __, foo) => {
  console.log('FOO',foo)
  const [eventName, [method, endpoint, body]] = foo
  console.log('fuuu', eventName,method,endpoint,body)
  const token = getToken()
  const req = apiRequest(method, endpoint, body)
  return [
    fx.fetch(token ? R.assocPath(['headers', 'authorization'], ` Token ${token}`, req)
                   : req,
      success(eventName),
      failure(eventName)
    )
  ]
})

export const auth = {
  current: () => ['GET', '/user'],
  login: (email, password) => ['post', '/users/login', { user: { email, password } }],
  register: (username, email, password) =>
    ['POST', '/users', { user: { username, email, password } }],
  save: user => ['PUT', '/user', { user }]
}

export const tags = {
  getAll: () => ['GET', '/tags']
}

const limit = (count, p) => `limit=${count}&offset=${p ? p * count : 0}`

export const articles = {
  all: page => ['GET', `/articles?${limit(10, page)}`],
  byAuthor: (author, page) => ['GET', `/articles?author=${encodeURIComponent(author)}&${limit(5, page)}`],
  byTag: (tag, page) => ['GET', `/articles?tag=${encodeURIComponent(tag)}&${limit(10, page)}`],
  del: slug => ['DELETE', `/articles/${slug}`],
  favorite: slug => ['POST', `/articles/${slug}/favorite`],
  favoritedBy: (author, page) => ['GET', `/articles?favorited=${encodeURIComponent(author)}&${limit(5, page)}`],
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
  unfollow: username => ['DELETE', `/profiles/${username}/follow`]
}
