import { connect } from 'react-redux'
import { dispatchSignatureAdaptor } from './dispatch'

const overwriteDispatch = props =>
  Object.assign({}, props, {
    dispatch: (event, args) =>
      props.dispatch(dispatchSignatureAdaptor([event, args]))
  })

/**
 * Framework-X style component wrapper
 * Second argument used as render function when called without a third argument
 * Provides a `dispatch` function to `renderFn` that uses  the Framework-X signature.
 * Dispatched events pass through the Redux pipeline and Framework-X when using `frameworkXMiddleware` from this package
 *
 * @param name
 * @param subscriptionFn
 * @param renderFn
 * @returns {*}
 */
export const component = (name, subscriptionFn, renderFn) => {
  let comp
  if (!renderFn) {
    comp = connect()((props, _) => subscriptionFn(overwriteDispatch(props)))
  } else {
    comp = connect(subscriptionFn)((props, _) => renderFn(overwriteDispatch(props)))
  }
  comp.displayName = `FxComponent(${name})` || 'FxComponent(unnamed)'
  return comp
}

