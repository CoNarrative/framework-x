import React from 'react'
import { ActionButton } from '../components/ActionButton'
import { CodeBlock } from '../components/CodeBlock'
import { H3 } from '../components/util'
import { evt } from '../eventTypes'
import { prettyStr } from '../util'


export const CaughtEffect = ({ caughtEffect, dispatch }) =>
  <div>
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <H3>Paused on effect:</H3>
      <div style={{ display: 'flex' }}>
        <ActionButton onClick={() => dispatch(evt.SKIP_EFFECT)}>
          Skip
        </ActionButton>
      </div>
    </div>
    <CodeBlock>{prettyStr(caughtEffect)}</CodeBlock>
  </div>


export const NextEffects = ({ nextEffects }) =>
  <div>
    <h3>Next effects:</h3>
    <CodeBlock>{prettyStr(nextEffects)}</CodeBlock>
  </div>


export const DoneEffects = ({ doneEffects }) =>
  <div>
    <h3>Effects performed: </h3>
    <CodeBlock>{prettyStr(doneEffects)}</CodeBlock>
  </div>
