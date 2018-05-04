import { createRouter } from 'framework-x'
import { createBrowserHistory as createHistory } from 'history'

/* set up router */
import { regEventFx, regFx } from './store'

const routes = [{
  id: 'root-incomplete',
  path: '/',
  action: ({ pushNamedRoute }) => pushNamedRoute('dashboard', { id: '24' }),
}, {
  id: 'dashboard',
  path: '/dashboard/:id',
}]

const history = createHistory()
const { pushNamedRoute, listen: startRouter } = createRouter({ history, routes })

regFx('route', pushNamedRoute)
regEventFx('route-change', ({ db }, [_, locationAndMatch]) => {
  // console.log('running event handler for route-change', locationAndMatch)
  return ({
    db: {
      ...db,
      router: locationAndMatch,
    },
  })
})
export { startRouter }
