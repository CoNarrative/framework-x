import React from 'react'
import styled from '@emotion/styled'
import * as theme from '../theme'

export const Button = styled.button( props => ({
  backgroundColor: theme.lightTeal,
  border: '1px solid ' + theme.black,
  display: 'flex',
  minHeight: 26,
  padding: '0 12px',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: theme.black,
  flexShrink: 0,
  ...props.rootCss,
}))
