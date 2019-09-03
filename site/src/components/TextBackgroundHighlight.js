import React from 'react'

//todo. @austin I wasn't able to converge on a ratio of the text's with to highlight,
// so this version highlights 100% of it. When we want to do something like <div>foo <Highlight>bar only</etc
// that works great (like  for the front page)
// Does not work great for markdown, where we receive the whole title, words are different lengths, etc.
// Suggest keeping this for when we want full coontrol,  making a new version off of it that does some set
// portion of the text's width
const highlightStyle = {
  padding: '2px 0px 4px 0',
  backgroundImage: 'linear-gradient(transparent 0%, transparent calc(50% - 8px), rgba(112, 224, 163, 1) calc(50% - 8px), rgba(112, 224, 163, 1) 100% )',
  backgroundPosition: '0 120%',
  backgroundSize: '100% 200%'
}
export const Highlight = ({ children }) => <span css={highlightStyle}>{children}</span>
