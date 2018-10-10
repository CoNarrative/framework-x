import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Context } from './context'

export class Provider extends Component {
  static propTypes = {
    getState: PropTypes.func.isRequired,
    subscribeToState: PropTypes.func.isRequired,
    dispatch: PropTypes.func
  }

  constructor(props) {
    super(props)
    const { subscribeToState, dispatch, getState } = this.props
    this.state = { appState: getState() }
    this.value = {
      appState: this.state.appState,
      dispatch
    }
    subscribeToState(state => this.setState({ appState: state }))
  }

  render() {
    if (this.state.appState !== this.value.state) {
      // Force a new object (required to trigger propagation)
      this.value = {
        appState: this.state.appState,
        dispatch: this.value.dispatch
      }
    }
    return (
      <Context.Provider
        value={this.value}
      >
        {this.props.children}
      </Context.Provider>
    )
  }
}
