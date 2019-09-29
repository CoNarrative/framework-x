import React from 'react'
import { CodeBlock } from './components/CodeBlock'
import { CaughtEffect, DoneEffects, NextEffects } from './effects/views'
import { EventEditor } from './event/views'
import { CurrentState, ReducedState, Reductions } from './state/views'
import { Suggestions } from './suggestions/views'
import { prettyStr } from './util'
import * as monaco from 'monaco-editor'


const altEnter = e => e.keyCode === monaco.KeyCode.Enter && e.altKey


export const ErrorScreen = ({ error, acc, env, dispatch }) => {
  const { queue, stack, events, reductions } = acc

  const caughtEffect = queue[0]
  const nextEffects = queue.slice(1)
  const doneEffects = stack
  const accumState = acc.state.db
  const originatingEvent = events[0]
  const caughtEvent = events[events.length - 1]
  const { message, suggestions, expected, received } = error.data
  const hasExpectedReceived = error.data.hasOwnProperty('expected')
                              || error.data.hasOwnProperty('received')


  return <div style={{
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    top: 0, left: 0,
    color: '#fff',
    background: '#333',
    overflow: 'scroll',
    display: 'flex',
    justifyContent: 'center'
  }}>
    <div style={{
      maxWidth: 964,
      minWidth: 300,
      paddingTop: '5vh',
      paddingLeft: '4.5vw',
      paddingRight: '4.5vw'
    }}>
      <h1 style={{ textAlign: 'center' }}>{error.type}</h1>

      {message && <h2 style={{ textAlign: 'center' }}>{message}</h2>}

      <div style={{ paddingTop: 15 }} />

      {caughtEvent && <EventEditor caughtEvent={caughtEvent} />}

      {suggestions && <Suggestions {...{ suggestions }} />}

      {hasExpectedReceived && <div>
        <h3>Expected:</h3>
        <CodeBlock>{expected}</CodeBlock>
        <h3>Received:</h3>
        <CodeBlock>{prettyStr(received)}</CodeBlock>
      </div>}

      {caughtEffect && <CaughtEffect {...{ dispatch, caughtEffect }} />}

      {nextEffects.length > 0 && <NextEffects {...{ nextEffects }} />}

      {doneEffects.length > 0 && <DoneEffects {...{ doneEffects }} />}

      {reductions.length > 0 && <Reductions {...{ reductions }} />}

      {reductions.length > 0 && <ReducedState {...{ accumState }} />}

      <CurrentState value={env.state.db} />

      <div style={{ paddingTop: 15 }} />

      <CodeBlock>{error.stack}</CodeBlock>
    </div>

  </div>
}
