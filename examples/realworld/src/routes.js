import * as R from 'ramda'
import * as api from './api'
import { isLoggedIn } from './auth/selectors'
import { evt } from './eventTypes'
import { fx } from './fx'
import { getUser } from './user/selectors'

export const routeIds = {
  HOME: 'home',
  LOGIN: 'login',
  REGISTER: 'register',
  EDITOR: 'editor',
  EDIT_STORY: 'editor/story',
  USER: 'user',
  USER_FAVORITES: 'user/favorites',
  SETTINGS: 'settings',
  ARTICLE: 'article',
}

export const routes = [{
  id: routeIds.HOME, path: '/',
  onEnter: (db, params, query) =>
    (isLoggedIn() ? [fx.dispatch(evt.API_REQUEST, [evt.GET_USER, api.auth.current()])] : [])
      .concat([
        fx.dispatch(evt.API_REQUEST, [evt.GET_TAGS, api.tags.getAll()]),
        fx.dispatch(evt.API_REQUEST,
          [evt.GET_ARTICLES, isLoggedIn() ? api.articles.feed() : api.articles.matching(query)])
      ])
}, {
  id: routeIds.LOGIN, path: '/login',
  onExit: () => [fx.db(R.dissoc('auth'))]
}, {
  id: routeIds.REGISTER, path: '/register',
  onExit: () => [fx.db(R.dissoc('auth'))]
}, {
  id: routeIds.EDITOR, path: '/editor',
  onEnter: () => {
    return [fx.db(R.assocPath(['editor', 'form'], {
      body: '',
      description: '',
      tagInput: '',
      tagList: [],
      title: ''
    }))]
  }
}, {
  id: routeIds.EDIT_STORY, path: '/editor/:id',
  onEnter: (db, params) => [
    fx.dispatch(evt.API_REQUEST, [evt.GET_ARTICLE_TO_EDIT, api.articles.get(params.id)]),
  ]
}, {
  id: routeIds.ARTICLE, path: '/article/:id',
  onEnter: (db, params) => {
    return [
      fx.dispatch(evt.API_REQUEST, [evt.GET_ARTICLE, api.articles.get(params.id)]),
      fx.dispatch(evt.API_REQUEST, [evt.GET_COMMENTS, api.comments.forArticle(params.id)])
    ]
  },
  onExit: () => [fx.db(R.pipe(R.dissoc('article'), R.dissoc('comments')))]
}, {
  id: routeIds.USER, path: '/@:username',
  onEnter: (db, params) => [
    fx.dispatch(evt.API_REQUEST, [evt.GET_PROFILE, api.profile.get(params.username)]),
    fx.dispatch(evt.API_REQUEST, [evt.GET_ARTICLES, api.articles.matching({
      author: params.username,
      limit: 5
    })]),
  ]
}, {
  id: routeIds.USER_FAVORITES, path: '/@:username/favorites',
  onEnter: (db, params) => [
    fx.dispatch(evt.API_REQUEST, [evt.GET_PROFILE, api.profile.get(params.username)]),
    fx.dispatch(evt.API_REQUEST, [evt.GET_ARTICLES, api.articles.favoritedBy(params.username)]),
  ]
}, {
  id: routeIds.SETTINGS, path: '/settings',
  onEnter: (db, params, query) => {
    //todo. guard  if not logged in / redirect
    return (isLoggedIn()
            ? [fx.dispatch(evt.API_REQUEST, [evt.GET_USER, api.auth.current()])]
            : [])
      .concat([fx.dispatch(evt.API_REQUEST, [evt.GET_PROFILE, api.profile.get(R.prop('username', getUser(db)))])])
  },
}]
