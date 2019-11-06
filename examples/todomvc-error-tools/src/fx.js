export const fx = {
  db: (newStateOrReducer) => ['db', newStateOrReducer],
  dispatch: (...args) => ['dispatch', args],
  notification: ({ type, message, duration }) => ['notification', {
    type,
    message,
    duration
  }]
}
