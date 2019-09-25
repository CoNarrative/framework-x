import React from 'react'
import { ErrorScreen } from './ErrorScreen'


export class Root extends React.Component {
  constructor(props) {
    super(props)
    const { subscribeToError } = this.props
    if (!subscribeToError) throw new Error('Must provide subscribeToError')
    this.state = { env: null, acc: null, error: null }
    subscribeToError((env, acc, error) => {
      this.setState({ env, acc, error })
    })
  }

  reset() {
    this.setState({ error: null, env: null, acc: null })
  }

  render() {
    return (
      <ErrorScreen
        error={this.state.error}
        env={this.state.env}
        acc={this.state.acc}
        reset={this.reset.bind(this)}
      />
    )
  }
}
