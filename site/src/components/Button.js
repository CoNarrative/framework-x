import React from 'react'
import styled from '@emotion/styled'
import * as theme from '../theme'

export const Button = styled.button( props => ({
  fontFamily: 'Space Grotesk',
  backgroundColor: theme.lightTeal,
  border: '1px solid ' + theme.black,
  display: 'flex',
  minHeight: 26,
  padding: '0 20px',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: theme.black,
  flexShrink: 0,
  fontWeight: 700,
  ...props.rootCss,
}))

export const Button3D = styled.button( props => ({
  fontFamily: 'Space Grotesk',
  fontSize: '0.84rem',
  backgroundColor: theme.lightTeal,
  border: '1px solid ' + theme.black,
  display: 'flex',
  minHeight: 38,
  padding: '0 20px',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: theme.black,
  flexShrink: 0,
  fontWeight: 700,
  boxShadow: props.light ? '1px 1px 0px #2DCD8C, 2px 2px 0px #2DCD8C, 3px 3px 0px #2DCD8C, 4px 4px 0px #2DCD8C, 5px 5px 0px #2DCD8C, 6px 6px 0px #2DCD8C, 7px 7px 0px #2DCD8C' : '1px 1px 0px #141515, 2px 2px 0px #141515, 3px 3px 0px #141515, 4px 4px 0px #141515, 5px 5px 0px #141515, 6px 6px 0px #141515, 7px 7px 0px #141515',
  ...props.rootCss,
}))
