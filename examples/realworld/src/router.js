import * as R from 'ramda'
import { createBrowserHistory } from 'history'
import { createRouter } from 'framework-x'
import { evt } from './eventTypes'
import { fx } from './fx'
import { routes } from './routes'
import { dispatch, regEventFx, regFx } from './store'
import { updateIn } from './util'


const ROUTE_HISTORY_LIMIT = 5

const history = createBrowserHistory()

const { pushNamedRoute, replaceNamedRoute, listen } = createRouter({
  history,
  routes,
  // basename:"#",
})

regFx('route', args => pushNamedRoute.apply(null, args))

regFx('redirect', args => replaceNamedRoute.apply(null, args))


const getRouteEffects = ({ db, match, type, route, prevRoute }) => {
  // if (type === 'INITIAL') {
  //   return {}//{ dispatch: [evt.SHOW_NOTIFICATION, {id: 'welcome',message: "Welcome!"}] }
  // }
  const onEnter =
    // !initialLoad &&
    R.path(['onEnter'], route) &&
    R.path(['onEnter'], route)(db, match.params)

  // ...except when we get no initial data event and need to get data (e.g. login)
  // const onEnterAlways =
  //   // (initialLoad || !initialLoad) &&
  //   R.path(['onEnterAlways'], route) &&
  //   R.path(['onEnterAlways'], route)(db, match.params, helpers);
  if (onEnter) return onEnter


  // if (onEnter ) {
  //   const events = R.reject(x => !!!x, [onEnterAlways, onEnter, onExit]);
  //   return { dispatchN2: events };
  // }
  return {}
}

regEventFx(evt.NAV_TO, ({ db }, _, x) => {
  console.log('ok',x)
  const [id,params,query] = x
  console.log('nav',id ,params,query)
  return [
    fx.db(R.assocPath(['router', 'match'], {
      params,
      route: R.find(R.propEq('id', id), routes)
    })),
    ['route', [id, params, query]]
  ]
})

regEventFx(evt.ROUTE_CHANGED, ({ db }, _, locationAndMatch) => {
  const { match, type } = locationAndMatch
  const route = R.path(['match', 'route'], locationAndMatch)
  const prevRoute = R.path(
    ['match', 'route'],
    R.head(R.pathOr([], ['router', 'history'], db))
  )

  const effects = getRouteEffects({ db, match, type, route, prevRoute })

  return [
    ['db', updateIn(
      ['router'],
      ({ history = [] } = {}) => {
        const nextHistory = R.take(ROUTE_HISTORY_LIMIT, R.append(locationAndMatch, history))
        return R.assoc('history', nextHistory, locationAndMatch)
      })],
    ...effects
  ]
})

export const startRouter = () =>
  listen(locationAndMatch => {
    dispatch(evt.ROUTE_CHANGED, locationAndMatch)
  })
