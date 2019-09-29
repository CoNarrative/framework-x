import React from 'react'
import { CodeBlock } from '../components/CodeBlock'
import { prettyStr } from '../util'


export const Reductions = ({ reductions }) =>
  <div>
    <h3>State transformations:</h3>
    <CodeBlock>{prettyStr(reductions)}</CodeBlock>
  </div>

export const ReducedState = ({accumState})=>
  <div>
    <h3>Accumulated state</h3>
    <CodeBlock>{prettyStr(accumState)}</CodeBlock>
  </div>

export const CurrentState = ({value})=>
  <div>
    <h3>Current state value</h3>
    <CodeBlock>{prettyStr(value)}</CodeBlock>
  </div>
