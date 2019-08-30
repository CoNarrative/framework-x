import * as R from 'ramda'

export const updateIn = R.curry((ks, f, m) => R.assocPath(ks, f(R.path(ks, m)), m))

export const parseJwt = (token) => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
    '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
  ).join(''))

  return JSON.parse(jsonPayload)
}
