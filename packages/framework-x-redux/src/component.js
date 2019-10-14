import { connect } from 'react-redux'

export const component = (name, subscriptionFn, renderFn) => {
  if (!renderFn) {
    const ok = connect()(renderFn)
    ok.displayName = name || 'FxComponent(unnamed)'
    return ok
  }
  const cool = connect(subscriptionFn)(renderFn)
  cool.displayName = name || 'FxComponent(unnamed)'
  return cool
}

