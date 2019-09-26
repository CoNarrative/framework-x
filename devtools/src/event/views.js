import React from 'react'
import { createSub } from 'framework-x'
import { CodeBlock } from '../CodeBlock'
import { ActionButton } from '../components/ActionButton'
import { Editor } from '../Editor'
import { evt } from '../eventTypes'
import { prettyStr } from '../util'
import { editedEvent } from './selectors'
import { component } from '../component'

const KEY = 'event'

const actions = ({
  edit: [{
    label: 'Run',
    event: props => [evt.RETRY_EVENT_WITH_EDIT, props.editedValue]
  }, {
    label: 'Cancel',
    event: () => [evt.CANCEL_EDIT, [KEY]]
  },],
  read: [{
    label: 'Edit',
    event: props => [evt.START_EDIT, [KEY, prettyStr(props.initialValue)]]
  }, {
    label: 'Retry',
    event: props => [evt.RETRY_EVENT, props.initialValue]
  }]
})

class HeaderControls extends React.Component {
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

export const EventEditor = component('EventEditor', createSub({ editedEvent }),
  ({ editedEvent, caughtEvent, dispatch }) => {
    return (
      <div>
        <HeaderControls
          initialValue={caughtEvent}
          editedValue={editedEvent ? editedEvent.value : null}
          mode={editedEvent ? 'edit' : 'read'}
          actions={actions}
          dispatch={dispatch} />
        {editedEvent
         ? <div>
           <Editor
             refCb={(editor, monaco) => {
               editor.focus()
               editor.setPosition({ lineNumber: 1, column: 999 })
             }}
             language={'json'}
             value={editedEvent.value}
             onChange={value => dispatch(evt.UPDATE_EDIT, [KEY, value])}
           />
           {editedEvent.error && <div>
             <CodeBlock>{JSON.stringify(editedEvent.error)}</CodeBlock>
           </div>}
         </div>
         : <CodeBlock>{prettyStr(caughtEvent)}</CodeBlock>}
      </div>
    )
  })
