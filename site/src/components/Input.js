import React from 'react'
import styled from '@emotion/styled'
import * as theme from '../theme'


export const Input = styled.input(props => ({
  outline: 'none',
  border: 'none',
  backgroundColor: 'unset',
  borderBottom: '1px solid ' + theme.darkGrey,
  fontFamily: 'Basier Square Mono',
  width: '100%',
  paddingBottom: 6,
  paddingLeft: 12,
  boxSizing: 'border-box',
  ...props.rootCss,
  '::placeholder': {
    color: theme.darkGrey,
    opacity: 1,
  },
}))

export const MultilineInput = styled.textarea({
  minHeight: 120,
  outline: 'none',
  backgroundColor: 'unset',
  border: '1px solid ' + theme.darkGrey,
  fontFamily: 'Basier Square Mono',
  fontSize: '0.8rem',
  width: '100%',
  paddingTop: 8,
  paddingLeft: 12,
  resize: 'vertical',
  boxSizing: 'border-box',
  '::placeholder': {
    color: theme.darkGrey,
    opacity: 1,
  },
})
