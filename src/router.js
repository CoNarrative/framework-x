import { memoize } from './util'
import pathToRegexp from 'path-to-regexp'
import querystring from 'query-string'

const toRegex = memoize(
  (path) => {
    const keys = []
    const pattern = pathToRegexp(path, keys)
    return {
      pattern,
      keys,
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
const matchFirst = (routes, uri) => matches(routes, uri)[0] // todo: exit early

export const createRouter = ({ routes, history, listen }) => {
  /* force pre-compile to fail-fast */
  routes.forEach((route) => {
    if (!route) throw new Error('Empty route')
    const { id, path } = route
    if (!id) throw new Error('Route without an id')
    if (!path) throw new Error('Route without a path')
    toRegex(path)
  })
  let location = {}

  const pushNamedRoute = (id, params, query) => {
    const route = this.routes.find(({ id: tid }) => tid === id)
    if (!route) throw new Error(`No route named "${id}"`)
    const { path } = route
    const url = compile(path)(params)
    history.push({
      pathname: url,
      search: query ? querystring.stringify(query) : history.location.search,
      state: history.location.state,
    })
  }
  return ({
    routes: routes.slice().reverse(),
    get query() {
      return querystring.parse(this.location.search)
    },
    pushNamedRoute,
    listen(cb) {
      if (!cb) throw new Error('You must provide a callback for the router.')
      const respondToHistory = loc => {
        location = loc
        const match = matchFirst(routes, location)
        if (match && match.route.action) match.route.action({ match, pushNamedRoute })
        cb({ location, match })
      }
      respondToHistory(history.location)
      history.listen(respondToHistory)
    },
  })
}
