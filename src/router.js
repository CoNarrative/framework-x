// import { memoize } from './util'
import pathToRegexp from 'path-to-regexp'
import querystring from 'query-string'

const memoize = fn => fn

const toRegex = memoize(
  (path) => {
    const keys = []
    const pattern = pathToRegexp(path, keys)
    return {
      pattern,
      keys
    }
  })
const compile = memoize(path => pathToRegexp.compile(path))

const matchAgainstPattern = ({ path }) => uri => {
  const { pattern, keys } = toRegex(path, keys)
  const match = pattern.exec(uri)
  if (!match) return null
  const params = Object.create(null)
  for (let i = 1; i < match.length; i++) {
    params[keys[i - 1].name] = match[i]
  }
  return params
}

/* single match */
// const matchFirst = (routes, uri) =>
//   chain(routes).map((route) => ({ route, params: matchAgainstPattern(route)(uri) }))
//                .find(({ params }) => params).value()

/* multi-match */
const matches = (routes, uri) =>
  routes.map(route => ({ route, params: matchAgainstPattern(route)(uri) }))
    .filter(({ params }) => params)
const matchFirst = (routes, uri) => matches(routes, uri)[0] // todo: implement short-circuit

export const createRouter = ({ routes, history, basename }) => {
  /* force pre-compile to fail-fast */
  routes.forEach((route) => {
    if (!route) throw new Error('Empty route')
    const { id, path } = route
    if (!id) throw new Error('Route without an id')
    if (!path) throw new Error('Route without a path')
    toRegex(path)
  })

  const makeRouteMethod = verb => (id, params, query) => {
    const route = routes.find(({ id: tid }) => tid === id)
    if (!route) throw new Error(`No route named "${id}"`)
    const { path } = route
    let url
    try {
      url = compile(path)(params)
    } catch (e) {
      console.warn(e)
    }
    const pathname = basename ? `${basename}${url}` : url
    history[verb]({
      pathname,
      search: query ? querystring.stringify(query) : history.location.search,
      state: history.location.state
    })
  }

  const pushNamedRoute = makeRouteMethod('push')
  const replaceNamedRoute = makeRouteMethod('replace')

  return ({
    replaceNamedRoute,
    pushNamedRoute,
    listen(onRouteChanged) {
      if (!onRouteChanged) throw new Error('You must provide a callback for the router.')
      const respondToHistory = (location, type) => {
        let pathname = location.pathname
        if (basename) {
          if (!location.pathname.startsWith(basename)) {
            return // nothing to do on routes outside of basename
          }
          pathname = pathname.substring(basename.length)
        }
        const match = matchFirst(routes, pathname)
        onRouteChanged({ location, match: match || { route:{id: 'not-found'} }, type,
          search: querystring.parse(location.search)
        })
      }
      history.listen(respondToHistory)
      respondToHistory(history.location, 'INITIAL')
    }
  })
}
