import React from 'react'
import * as R from 'ramda'
import { component, createSub } from 'framework-x'
import { getNotificationsList } from '../selectors'


const Notification = ({ type, message }) => {
  return (
    <div style={{
      fontSize: 20,
      width: 250,
      height: 40,
      background: '#000',
      color: '#fff',
      padding: 25,
      borderRadius: 20,
      marginTop: 10
    }}>
      {message}
    </div>
  )
}

export const Notifications = component('Notifications',
  createSub({
    notifications: getNotificationsList
  }),
  ({ notifications }) => {
    if (R.isEmpty(notifications)) {return null}
    return (
      <div style={{ position: 'absolute', right: 15, bottom: 15, zIndex: 3 }}>
        {notifications.map(({ type, message }, i) =>
          <Notification
            key={i}
            {...{ type, message }}
          />)}
      </div>
    )
  })
