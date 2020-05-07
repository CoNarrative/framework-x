import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Context } from './context'

type ProviderProps = {
  getState: () => any
  subscribeToState: (state: any) => any
  dispatch: (evt: string, args: any) => any
}

export class Provider extends Component<ProviderProps, { appState: any }> {
  static propTypes = {
    getState: PropTypes.func.isRequired,
    subscribeToState: PropTypes.func.isRequired,
    dispatch: PropTypes.func
  }
  private value: { appState: any, dispatch: any }

  constructor(props: ProviderProps) {
    super(props)
    const { subscribeToState, dispatch, getState } = this.props
    if (!subscribeToState || !dispatch || !getState) throw new Error('Must provide subscribeToState, dispatch, and getState')
    this.state = { appState: getState() }
    this.value = {
      appState: this.state.appState,
      dispatch
    }
    subscribeToState(state => this.setState({ appState: state }))
  }

  render() {
    if (this.state.appState !== this.value.appState) {
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

