import React from 'react'
import * as R from 'ramda'
import { component, createSub } from 'framework-x'
import { getNotificationsList } from '../selectors'


const Notification = ({ type, message }) => {
  return (
    <div>
      {message}
    </div>
  )
}

export const Notifications = component('Notifications',
  createSub({
    notifications: getNotificationsList
  }),
  ({ notifications }) => {
    return !R.isEmpty(notifications)
           && notifications.map(({ type, message }, i) =>
        <Notification
          key={i}
          {...{ type, message }}
        />
      )
  })
