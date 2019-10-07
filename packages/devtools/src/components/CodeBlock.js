import React from 'react'
import Highlight from 'react-highlight.js'
import './../hljs-railscasts.css'


export const copyToClipboard = text => {
  const ta = document.createElement('textarea')
  ta.style.position = 'absolute'
  ta.style.right = '99999px'
  document.body.appendChild(ta)
  ta.value = text
  ta.focus()
  ta.select()
  document.execCommand('copy')
  document.body.removeChild(ta)
}

export class CodeBlock extends React.Component {
  state = { copied: null }

  onCopy(code) {
    copyToClipboard(code)
    this.setState({ copied: true })
  }

  render() {
    const { copied } = this.state
    const code = this.props.children
    return (
      <div onMouseEnter={() => this.setState({ hovered: true })}
           onMouseLeave={() => this.setState({ hovered: false, copied: false })}
      >
        {this.state.hovered &&
         <div style={{ position: 'relative' }}>
           <div style={{ position: 'absolute', top: 5, right: 10, cursor: 'pointer' }}
                onClick={() => this.onCopy(code)}>
             {copied ? 'Copied!' : 'Copy'}
           </div>
         </div>
        }
        <Highlight language={'js'} style={{ width: '100%' }}>
          {code}
        </Highlight>
      </div>
    )
  }
}
