import { createRouter } from 'framework-x'
import { createBrowserHistory as createHistory } from 'history'

/* set up router */
import { regEventFx, regFx } from './store'

const routes = [{
  id: 'root-incomplete',
  path: '/',
  action: () => {
    console.log('redirecting to dashboard...')
    return ({ redirect: ['dashboard', { id: '24' }] })
  }
}, {
  id: 'dashboard',
  path: '/dashboard/:id'
}]

const history = createHistory()
const { pushNamedRoute, replaceNamedRoute, listen: startRouter } = createRouter({
  history,
  routes
})

regFx('route', args => pushNamedRoute.apply(null, args))
regFx('redirect', args => replaceNamedRoute.apply(null, args))

regEventFx('route-change', ({ db }, _, locationAndMatch) => {
  const { match, type } = locationAndMatch
  const effects = (match && match.route.action) ? match.route.action({
    match
  }) : {}
  return ({
    db: {
      ...db,
      router: locationAndMatch
    },
    ...effects
  })
})
export { startRouter }
