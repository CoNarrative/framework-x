import assocPath from 'ramda/es/assocPath'
import pathOr from 'ramda/es/pathOr'

export const makeGetSet = (path, defaultValue = undefined) =>
  [pathOr(defaultValue, path), assocPath(path)]
