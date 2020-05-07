import React, { Component, PureComponent } from 'react'
import { Context } from './context'
// import hoistStatics from 'hoist-non-react-statics'

const getNonChildProps = props => {
  const otherProps = Object.assign({}, props)
  delete otherProps.children
  return otherProps
}

class Prevent extends PureComponent {
  render() {
    // @ts-ignore
    const { _children, ...rest } = this.props
    return _children()(rest)
  }
}

export class Subscribe extends Component {
  // We do this so the shouldComponentUpdate of Prevent will ignore the children prop
  _children = () => this.props.children
  prevent = ({ appState, dispatch }) => {
    // @ts-ignore
    const { otherProps, selector } = this.props
    return (
      <Prevent
        dispatch={dispatch}
        {...selector(appState, otherProps)}
        {...otherProps}
        _children={this._children} />
    )
  }

  render() {
    return (
      <Context.Consumer>
        {this.prevent}
      </Context.Consumer>
    )
  }
}

/**
 * for wrapping full classes AND inlining via subscription
 * very simple use/abuse of Context for ordered state propagation,
 * but results in deeper nesting than ideal
 */

export const connect = selector => (WrappedComponent) => {
  const ConnectedComponent = (props) => {
    // @ts-ignore
    return <Subscribe selector={selector} otherProps={getNonChildProps(props)}>
      {injectedProps => <WrappedComponent {...props} {...injectedProps} />}
    </Subscribe>
  }
  ConnectedComponent.displayName = `FxConnect(${WrappedComponent.displayName ||
                                              WrappedComponent.name || '-'})`
  return ConnectedComponent
}
