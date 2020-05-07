//
// export const fx = {
//   db: (newStateOrReducer) => ['db', newStateOrReducer],
//   dispatch: (...args) => ['dispatch', args],
//   notification: ({ type, message, duration }) => ['notification', {
//     type,
//     message,
//     duration
//   }]
// }
const evt = {
    SELECT: 'select'
};
const EventFns = {
    [evt.SELECT]: ({ id }) => id
};
const myEventHandlers = {
    [evt.SELECT]: ({ db }, { id }) => {
    },
};
class SelectEvent {
    constructor({ id }) {
        this.id = id;
    }
}
SelectEvent.eventName = 'select';
const regHandler;
// dispatch(new SelectEvent({ id: 2 }))
// regEventFx<T>(T, (T) => any)
// const events = [{ name: , fn: ({ id }) => id }]
