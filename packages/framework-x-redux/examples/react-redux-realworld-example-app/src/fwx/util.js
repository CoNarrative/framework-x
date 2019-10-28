import * as R from 'ramda'

export const updateIn = R.curry((ks, f, m) => R.assocPath(ks, f(R.path(ks, m)), m))
