import React from 'react'
import styled from '@emotion/styled'
import * as theme from '../theme'

//todo. @austin I wasn't able to converge on a ratio of the text's with to highlight,
// so this version highlights 100% of it. When we want to do something like <div>foo <Highlight>bar only</etc
// that works great (like  for the front page)
// Does not work great for markdown, where we receive the whole title, words are different lengths, etc.
// Suggest keeping this for when we want full coontrol,  making a new version off of it that does some set
// portion of the text's width

const HighlightStyle = styled.div( props => ({
  width: props.h1 ?  '78%' : '110%',
  position: 'absolute',
  top: 0,
  bottom: '0.2rem',
  left: props.h1 ? '-20px' : '-5%',
  right: props.h1 ? 'unset' : '-5%',
  backgroundColor: props.code ? theme.lightGrey : theme.lightTeal,
  zIndex: -1
}))

const Container = styled.div( props => ({
  display: 'flex',
  position: 'relative',
  ...props.rootCss
}))

export const Highlight = ({ children, code, rootCss, h1 }) => <Container rootCss={rootCss}><HighlightStyle h1={h1} code={code}/><div>{children}</div></Container>
