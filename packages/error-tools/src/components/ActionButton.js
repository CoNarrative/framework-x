import React from 'react'

export const ActionButton = ({ style, onClick, children }) =>
  <div style={Object.assign({}, { cursor: 'pointer' }, style)}
       onClick={onClick}>{children}</div>
