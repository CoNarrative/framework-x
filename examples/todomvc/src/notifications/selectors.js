import { derive, makeGetSet } from 'framework-x'
import * as R from 'ramda'


export const [getNotificationsList, setNotificationsList] = makeGetSet(['notifications'])

export const getNotificationsMap = derive(
  [getNotificationsList],
  R.indexBy(R.prop('id')))
