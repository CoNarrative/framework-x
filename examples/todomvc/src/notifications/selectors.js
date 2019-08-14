import { derive, makeGetSet } from 'framework-x'
import * as R from 'ramda'

const makeGetSet = (path, defaultValue = null) =>
  [R.pathOr(defaultValue, path), R.assocPath(path)]

export const [getNotificationsList, setNotificationsList] = makeGetSet(['notifications'])

export const getNotifications = derive(
  [getNotificationsList],
  R.indexBy(R.prop('id')))
