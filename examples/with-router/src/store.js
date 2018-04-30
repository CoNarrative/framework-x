import { initStore, createRouter } from 'framework-x'
import devtools from 'react-waterfall-redux-devtools-middleware'
import { createBrowserHistory as createHistory } from 'history'


/* set up router */
const routes = [{
  id: 'root-incomplete',
  path: '/',
  action: ({ pushNamedRoute }) => pushNamedRoute('dash-charts'),
}, {
  id: 'dashboard',
  path: '/dashboard/:id',
}]


const history = createHistory()
const { pushNamedRoute, listen: startRouter } = createRouter({ history, routes })
const prod = process.env.NODE_ENV === 'production'

const store = {
  initialState: {},
}
export const { Provider, connect, dispatch, Subscriber, regEventFx, regFx } =
  initStore(store, !prod && devtools())

regFx('route', pushNamedRoute)
regEventFx('route-change', ({ db }, { _, locationAndMatch }) => {
  console.log('running event handler for route-change')
  return ({
    db: {
      ...db,
      foo: 'bar',
      router: locationAndMatch,
    },
  })
})

regEventFx('initialize', () => ({
  db: {
    count: 5,
  },
}))

regEventFx('initialize', () => {
  startRouter(locationAndMatch => {
    console.log('router started. dispatching initial route-change event')
    dispatch('route-change', locationAndMatch)
  })
  return {}
})
// regCoeffect({pusnNamedRoute})

