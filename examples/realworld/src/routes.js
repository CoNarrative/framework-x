import * as api from './api'
import { isLoggedIn } from './auth/selectors'
import { evt } from './eventTypes'
import { fx } from './fx'

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

export const routes = [
  {
    id: routeIds.HOME,
    path: '/',
    onEnter: (db, params) => {
      console.log('ent')
      return [
        fx.dispatch(evt.API_REQUEST, [evt.GET_TAGS, api.tags.getAll()]),
        fx.dispatch(evt.API_REQUEST, [evt.GET_ARTICLES, isLoggedIn()
                                                       ? api.articles.feed()
                                                       : api.articles.all()])
      ]
    },
    // onExit: formRouteExit
  },
  { id: routeIds.LOGIN, path: '/login' },
  { id: routeIds.REGISTER, path: '/register' },
  { id: routeIds.EDITOR, path: '/editor' },
  { id: routeIds.EDIT_STORY, path: '/editor/:id' },
  { id: routeIds.ARTICLE, path: '/article/:id' },
  { id: routeIds.USER, path: '/@:username' },
  { id: routeIds.USER_FAVORITES, path: '/@:username/favorites' },
  { id: routeIds.SETTINGS, path: '/settings' }
]
