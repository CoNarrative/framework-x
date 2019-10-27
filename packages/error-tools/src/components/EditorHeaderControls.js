import React from 'react'
import { ActionButton } from './ActionButton'


export class EditorHeaderControls extends React.Component {
  constructor(props) {
    super(props)
    this.props = props
    this.actions = {}
    this.actions.edit = this.props.actions.edit.map(({ event }) => () => this.props.dispatch(...event(this.props)))
    this.actions.read = this.props.actions.read.map(({ event }) => () => this.props.dispatch(...event(this.props)))
  }

  shouldComponentUpdate(nextProps) {
    return this.props.editedValue !== nextProps.editedValue
           || this.props.mode !== nextProps.mode
  }

  render() {
    const { actions, mode } = this.props
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3>Event</h3>
        <div style={{ display: 'flex' }}>
          {actions[mode].map(({ label }, i) =>
            <ActionButton
              key={i}
              style={i === actions[mode].length - 2 ? {} : { marginLeft: 15 }}
              onClick={this.actions[mode][i].bind(this)}>
              {label}
            </ActionButton>
          )}
        </div>
      </div>
    )
  }
}
