import { connect } from 'react-redux'

export const component = (subscriptionFn, renderFn) =>
  connect(subscriptionFn)(renderFn)
