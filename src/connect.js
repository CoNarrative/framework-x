/*
 * for wrapping full classes AND inlining via subscription
 * uses PureComponent -- but results in deep nesting
 */

import React, { Component, PureComponent } from 'react'
import { Context } from './context'

const getNonChildProps = props => {
  const otherProps = Object.assign({}, props)
  delete otherProps.children
  return otherProps
}

class Prevent extends PureComponent {
  render() {
    const { _children, ...rest } = this.props
    return _children()(rest)
  }
}

export class Subscribe extends Component {
  // We do this so the shouldComponentUpdate of Prevent will ignore the children prop
  _children = () => this.props.children
  prevent = ({ appState, dispatch }) => {
    const { otherProps, selector } = this.props
    return (
      <Prevent
        dispatch={dispatch}
        {...selector(appState)}
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

export const connect = selector => WrappedComponent => {
  const ConnectedComponent = (props) => {
    return <Subscribe selector={selector} otherProps={getNonChildProps(props)}>
      {injectedProps => <WrappedComponent {...props} {...injectedProps} />}
    </Subscribe>
  }
  ConnectedComponent.displayName = `Connect(${WrappedComponent.displayName ||
                                              WrappedComponent.name || '-'})`
  return ConnectedComponent
}
