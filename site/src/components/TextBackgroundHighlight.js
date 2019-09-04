import React from 'react'
import * as theme from '../theme'

//todo. @austin I wasn't able to converge on a ratio of the text's with to highlight,
// so this version highlights 100% of it. When we want to do something like <div>foo <Highlight>bar only</etc
// that works great (like  for the front page)
// Does not work great for markdown, where we receive the whole title, words are different lengths, etc.
// Suggest keeping this for when we want full coontrol,  making a new version off of it that does some set
// portion of the text's width
const highlightStyle = {
  padding: '2px 8px 4px 8px',
  marginLeft: -4,
  marginRight: -4,
  backgroundColor: theme.lightTeal,
  backgroundPosition: '0 120%',
  backgroundSize: '100% 200%'
}
export const Highlight = ({ children }) => <span css={highlightStyle}>{children}</span>
