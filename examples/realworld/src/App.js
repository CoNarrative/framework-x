import React from 'react'
import { component, createSub } from 'framework-x'
import { routeIds } from './routes'
import { getRouteId } from './routes/selectors'
import { Header } from './components/Header'
import Article from './components/Article'
import Editor from './components/Editor'
import { Home } from './components/Home'
import { Login } from './auth/Login'
import ProfileFavorites from './components/ProfileFavorites'
import { Register } from './auth/Register'
import { Settings } from './components/Settings'


export const App = component('App', createSub({ getRouteId }), ({ routeId }) =>
  <div>
    <Header />
    {(() => {
      switch (routeId) {
        case routeIds.HOME: return <Home />
        case routeIds.LOGIN: return <Login />
        case routeIds.REGISTER: return <Register />
        case routeIds.EDITOR:
          case routeIds.EDIT_STORY:
          return <Editor />
        case routeIds.ARTICLE: return <Article />
        case routeIds.SETTINGS: return <Settings />
        case routeIds.USER_FAVORITES: return <ProfileFavorites />
        case routeIds.USER: return <ProfileFavorites />
        default:
          console.log('not found', routeId)
      }
    })()}
  </div>
)
