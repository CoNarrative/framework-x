import React from 'react'
import { CodeBlock } from '../components/CodeBlock'

export const Suggestions = ({ suggestions }) =>
  <div>
    <h3>{'Code suggestion' + (suggestions.length > 1 ? 's' : '')}:</h3>
    {suggestions.map(({ code }, i) => <CodeBlock key={i}>{code}</CodeBlock>)}
  </div>
