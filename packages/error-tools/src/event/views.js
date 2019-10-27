import React from 'react'
import { createSub } from 'framework-x'
import { SECTION_NAME } from '../constants'
import { getAcc, getEnv } from '../selectors'
import { CodeBlock } from './../components/CodeBlock'
import { Editor } from './../components/Editor'
import { EditorHeaderControls } from './../components/EditorHeaderControls'
import { evt } from '../eventTypes'
import {
  editedEvent,
  initialEditedEventValue,
  initialEditedEventValueStr,
  isEditingEvent
} from './selectors'
import { component } from '../context/component'

const KEY = SECTION_NAME.CURRENT_EVENT

const CHAR = {
  alt: '\u2387',
  enter: '\u21B5'
}

const actions = ({
  edit: [{
    label: `Run (${CHAR.alt} + ${CHAR.enter})`,
    event: props => [evt.RETRY_EVENT_WITH_EDIT, props.editedValue]
  }, {
    label: 'Cancel',
    event: () => [evt.DISCARD_EDIT, [KEY]]
  },],
  read: [{
    label: 'Edit',
    event: props => [evt.START_EDIT, [KEY, props.initialValue]]
  }, {
    label: 'Retry',
    event: props => [evt.RETRY_EVENT, props.initialValue]
  }]
})

export const EventEditor = component('EventEditor',
  createSub({
    editedEvent,
    getEnv,
    getAcc,
    isEditing: isEditingEvent,
    initialEditedEventValue,
    initialEditedEventValueStr
  }), ({
    editedEvent,
    isEditing,
    env,
    acc,
    dispatch,
    initialEditedEventValue,
    initialEditedEventValueStr
  }) => {
    return (
      <div>
        <EditorHeaderControls
          initialValue={initialEditedEventValue}
          editedValue={editedEvent ? editedEvent.value : null}
          mode={editedEvent ? 'edit' : 'read'}
          actions={actions}
          dispatch={dispatch} />
        {isEditing
         ? <div>
           <Editor
             refCb={(editor, monaco) => {
               editor.focus()
               editor.setPosition({ lineNumber: 1, column: 999 })
             }}
             env={env}
             acc={acc}
             onRun={v => dispatch(evt.RETRY_EVENT_WITH_EDIT, v)}
             language={'json'}
             value={editedEvent.value}
             onChange={value => dispatch(evt.UPDATE_EDIT, [KEY, value])}
           />
           {editedEvent.error && <div>
             <CodeBlock>{JSON.stringify(editedEvent.error)}</CodeBlock>
           </div>}
         </div>
         : <CodeBlock>{initialEditedEventValueStr}</CodeBlock>}
      </div>
    )
  })
