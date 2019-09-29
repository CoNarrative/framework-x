import React from 'react'
import { createSub } from 'framework-x'
import { CodeBlock } from './../components/CodeBlock'
import { Editor } from './../components/Editor'
import { EditorHeaderControls } from './../components/EditorHeaderControls'
import { evt } from '../eventTypes'
import { prettyStr } from '../util'
import { editedEvent } from './selectors'
import { component } from '../component'

const KEY = 'event'

const CHAR = {
  alt:'\u2387',
  enter:'\u21B5'
}

const actions = ({
  edit: [{
      label: `Run (${CHAR.alt} + ${CHAR.enter})`,
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

export const EventEditor = component('EventEditor', createSub({ editedEvent }),
  ({ editedEvent, caughtEvent, dispatch }) => {
    return (
      <div>
        <EditorHeaderControls
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
             onRun={v=>dispatch(evt.RETRY_EVENT_WITH_EDIT,v)}
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
