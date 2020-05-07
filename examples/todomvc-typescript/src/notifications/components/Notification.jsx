import React from 'react';
import * as R from 'ramda';
import { component, createSub } from 'framework-x';
import { getNotificationsList } from '../selectors';
const Notification = ({ type, message }) => {
    return (<div style={{
        background: 'rgba(0,0,0,.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        padding: '20px 40px',
        marginBottom: 10,
        marginRight: 10,
        fontWeight: 500
    }}>
      {message}
    </div>);
};
export const Notifications = component('Notifications', createSub({
    notifications: getNotificationsList
}), ({ notifications }) => {
    return (<div style={{ position: 'absolute', right: 0, bottom: 0 }}>
        {!R.isEmpty(notifications)
        && notifications.map(({ type, message }, i) => <Notification key={i} {...{ type, message }}/>)}
      </div>);
});
