import { derive } from 'framework-x'
import * as R from 'ramda'

export const getNotificationsList  = R.path(['notifications'])

export const getNotifications  = derive(
  [getNotificationsList],
  R.indexBy(R.prop('id')))
