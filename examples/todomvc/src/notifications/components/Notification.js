import { component, createSub } from 'framework-x'
import { getNotifications } from '../selectors'


export const Notifications = component('Notifications',
  createSub({
    notifications: getNotifications
  }),
  ({ notifications }) => {


  })
