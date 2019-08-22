import React from 'react'
import { component, createSub } from 'framework-x'
import { Profile } from './profile/views'
import { routeIds } from './routes'
import { getRouteId } from './routes/selectors'
import { Header } from './components/Header'
import { Article } from './articles/views'
import { Editor } from './editor/views'
import { Home } from './components/Home'
import { Login } from './auth/views'
import { Register } from './auth/views'
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
        case routeIds.USER:
        case routeIds.USER_FAVORITES:
          return <Profile />
        default:
          console.error('not found', routeId)
          return <div>Not found</div>
      }
    })()}
  </div>
)
