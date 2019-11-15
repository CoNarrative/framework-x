import React from 'react'
import { FoldableTree } from '../components/FoldableTree'


export const Reductions = ({ reductions }) =>
  <div>
    <h3>State transformations:</h3>
    <FoldableTree expandLevel={2} value={reductions} />
  </div>

export const ReducedState = ({ accumState }) =>
  <div>
    <h3>Accumulated state</h3>
    <FoldableTree  expandLevel={2} value={accumState} />
  </div>

export const CurrentState = ({ value }) =>
  <div>
    <h3>Current state value</h3>
    <FoldableTree expandLevel={2} value={value}/>
  </div>
