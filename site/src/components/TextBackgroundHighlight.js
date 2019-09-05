import React from 'react'
import * as theme from '../theme'

//todo. @austin I wasn't able to converge on a ratio of the text's with to highlight,
// so this version highlights 100% of it. When we want to do something like <div>foo <Highlight>bar only</etc
// that works great (like  for the front page)
// Does not work great for markdown, where we receive the whole title, words are different lengths, etc.
// Suggest keeping this for when we want full coontrol,  making a new version off of it that does some set
// portion of the text's width

const highlightStyle = {
  width: '110%',
  position: 'absolute',
  top: 0,
  bottom: '0.2rem',
  left: '-5%',
  right: '-5%',
  backgroundColor: theme.lightTeal,
  zIndex: -1
}

const container = {
  display: 'flex',
  position: 'relative',
  marginLeft: 10  ,
}

export const Highlight = ({ children }) => <div css={container}><div css={highlightStyle}/><span>{children}</span></div>
