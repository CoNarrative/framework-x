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
  id: routeIds.HOME,
  path: '/',
  onEnter: (db, params, query) => {
    return (isLoggedIn()
            ? [fx.dispatch(evt.API_REQUEST, [evt.GET_USER, api.auth.current()])]
            : []).concat([
      fx.dispatch(evt.API_REQUEST, [evt.GET_TAGS, api.tags.getAll()]),
      fx.dispatch(evt.API_REQUEST, [evt.GET_ARTICLES, isLoggedIn()
                                                      ? api.articles.feed()
                                                      : api.articles.matching(query)])
    ])
  },
}, {
  id: routeIds.LOGIN,
  path: '/login',
  onExit: () => [fx.db(R.dissoc('auth'))]
}, {
  id: routeIds.REGISTER,
  path: '/register',
  onExit: () => [fx.db(R.dissoc('auth'))]
},
  { id: routeIds.EDITOR, path: '/editor' },
  { id: routeIds.EDIT_STORY, path: '/editor/:id' },
  { id: routeIds.ARTICLE, path: '/article/:id' },
  { id: routeIds.USER, path: '/@:username' },
  { id: routeIds.USER_FAVORITES, path: '/@:username/favorites' },
  {
    id: routeIds.SETTINGS, path: '/settings',
    onEnter: (db, params, query) => {
      //todo. guard  if not logged in / redirect
      return (isLoggedIn()
              ? [fx.dispatch(evt.API_REQUEST, [evt.GET_USER, api.auth.current()])]
              : [])
        .concat([fx.dispatch(evt.API_REQUEST, [evt.GET_PROFILE, api.profile.get(R.prop('username', getUser(db)))])])
    },
  }
]
