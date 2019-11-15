import { derive } from 'framework-x'
import * as R from 'ramda'


export const getNotificationsList = R.path(['notifications'])

export const getNotificationsMap = derive(
  [getNotificationsList],
  R.indexBy(R.prop('id')))
