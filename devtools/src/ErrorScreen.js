import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { CodeBlock } from './CodeBlock'
import { prettyStr } from './util'
import * as monaco from 'monaco-editor'
import PropTypes from 'prop-types'

const theme = {
  'base': 'vs-dark',
  'inherit': true,
  'rules': [
    {
      'foreground': '999999',
      'token': 'comment'
    },
    {
      'foreground': 'cccccc',
      'token': 'keyword.operator.class'
    },
    {
      'foreground': 'cccccc',
      'token': 'constant.other'
    },
    {
      'foreground': 'cccccc',
      'token': 'source.php.embedded.line'
    },
    {
      'foreground': 'f2777a',
      'token': 'variable'
    },
    {
      'foreground': 'f2777a',
      'token': 'support.other.variable'
    },
    {
      'foreground': 'f2777a',
      'token': 'string.other.link'
    },
    {
      'foreground': 'f2777a',
      'token': 'entity.name.tag'
    },
    {
      'foreground': 'f2777a',
      'token': 'entity.other.attribute-name'
    },
    {
      'foreground': 'f2777a',
      'token': 'meta.tag'
    },
    {
      'foreground': 'f2777a',
      'token': 'declaration.tag'
    },
    {
      'foreground': 'f2777a',
      'token': 'markup.deleted.git_gutter'
    },
    {
      'foreground': 'f99157',
      'token': 'constant.numeric'
    },
    {
      'foreground': 'f99157',
      'token': 'constant.language'
    },
    {
      'foreground': 'f99157',
      'token': 'support.constant'
    },
    {
      'foreground': 'f99157',
      'token': 'constant.character'
    },
    {
      'foreground': 'f99157',
      'token': 'variable.parameter'
    },
    {
      'foreground': 'f99157',
      'token': 'punctuation.section.embedded'
    },
    {
      'foreground': 'f99157',
      'token': 'keyword.other.unit'
    },
    {
      'foreground': 'ffcc66',
      'token': 'entity.name.class'
    },
    {
      'foreground': 'ffcc66',
      'token': 'entity.name.type.class'
    },
    {
      'foreground': 'ffcc66',
      'token': 'support.type'
    },
    {
      'foreground': 'ffcc66',
      'token': 'support.class'
    },
    {
      'foreground': '99cc99',
      'token': 'string'
    },
    {
      'foreground': '99cc99',
      'token': 'constant.other.symbol'
    },
    {
      'foreground': '99cc99',
      'token': 'entity.other.inherited-class'
    },
    {
      'foreground': '99cc99',
      'token': 'markup.heading'
    },
    {
      'foreground': '99cc99',
      'token': 'markup.inserted.git_gutter'
    },
    {
      'foreground': '66cccc',
      'token': 'keyword.operator'
    },
    {
      'foreground': '66cccc',
      'token': 'constant.other.color'
    },
    {
      'foreground': '6699cc',
      'token': 'entity.name.function'
    },
    {
      'foreground': '6699cc',
      'token': 'meta.function-call'
    },
    {
      'foreground': '6699cc',
      'token': 'support.function'
    },
    {
      'foreground': '6699cc',
      'token': 'keyword.other.special-method'
    },
    {
      'foreground': '6699cc',
      'token': 'meta.block-level'
    },
    {
      'foreground': '6699cc',
      'token': 'markup.changed.git_gutter'
    },
    {
      'foreground': 'cc99cc',
      'token': 'keyword'
    },
    {
      'foreground': 'cc99cc',
      'token': 'storage'
    },
    {
      'foreground': 'cc99cc',
      'token': 'storage.type'
    },
    {
      'foreground': 'cc99cc',
      'token': 'entity.name.tag.css'
    },
    {
      'foreground': 'cdcdcd',
      'background': 'f2777a',
      'token': 'invalid'
    },
    {
      'foreground': 'cdcdcd',
      'background': '99cccc',
      'token': 'meta.separator'
    },
    {
      'foreground': 'cdcdcd',
      'background': 'cc99cc',
      'token': 'invalid.deprecated'
    },
    {
      'foreground': 'ffffff',
      'token': 'markup.inserted.diff'
    },
    {
      'foreground': 'ffffff',
      'token': 'markup.deleted.diff'
    },
    {
      'foreground': 'ffffff',
      'token': 'meta.diff.header.to-file'
    },
    {
      'foreground': 'ffffff',
      'token': 'meta.diff.header.from-file'
    },
    {
      'foreground': '718c00',
      'token': 'markup.inserted.diff'
    },
    {
      'foreground': '718c00',
      'token': 'meta.diff.header.to-file'
    },
    {
      'foreground': 'c82829',
      'token': 'markup.deleted.diff'
    },
    {
      'foreground': 'c82829',
      'token': 'meta.diff.header.from-file'
    },
    {
      'foreground': 'ffffff',
      'background': '4271ae',
      'token': 'meta.diff.header.from-file'
    },
    {
      'foreground': 'ffffff',
      'background': '4271ae',
      'token': 'meta.diff.header.to-file'
    },
    {
      'foreground': '3e999f',
      'fontStyle': 'italic',
      'token': 'meta.diff.range'
    }
  ],
  'colors': {
    'editor.foreground': '#CCCCCC',
    'editor.background': '#2D2D2D',
    'editor.selectionBackground': '#515151',
    'editor.lineHighlightBackground': '#393939',
    'editorCursor.foreground': '#CCCCCC',
    'editorWhitespace.foreground': '#6A6A6A'
  }
}

const H3 = ({ children }) =>
  <div style={{ fontSize: '1.17em', fontWeight: 'bold' }}>{children}</div>

const ActionButton = ({ style, onClick, children }) =>
  <div style={style} onClick={onClick}>{children}</div>

const Suggestions = ({ suggestions }) =>
  <div>
    <h3>{'Code suggestion' + (suggestions.length > 1 ? 's' : '')}:</h3>
    {suggestions.map(({ code }, i) => <CodeBlock key={i}>{code}</CodeBlock>)}
  </div>

const altEnter = e => e.keyCode === monaco.KeyCode.Enter && e.altKey

class EditorBase extends React.Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
  }

  state = {}

  editorWillMount(monaco) {
    monaco.editor.defineTheme('tomorrow-night-eighties', theme)
    monaco.editor.setTheme('tomorrow-night-eighties')
  }

  editorDidMount(editor, monaco) {
    // editor.onKeyDown((e) => {
    //   if (altEnter(e)) {
    //
    //   }
    // })
  }

  onChange(value) {
    this.setState({ value })
  }

  render() {
    return (
      <MonacoEditor
        ref={this.props.innerRef}
        value={this.state.value}
        defaultValue={this.props.value}
        options={{
          lineNumbers: 'off',
          fontSize: 16,
          minimap: { enabled: false }
        }}
        theme={'tomorrow-night-eighties'}
        language={'javascript'}
        width={'100%'}
        height={this.props.height || 350}
        editorWillMount={this.editorWillMount.bind(this)}
        editorDidMount={this.editorDidMount.bind(this)}
        onChange={this.onChange.bind(this)}
      />
    )
  }

}

const Editor = React.forwardRef((props, ref) => <EditorBase innerRef={ref}  {...props} />)

export class ErrorScreen extends React.Component {
  state = { editing: {} }

  editEventRef = React.createRef()
  editorWillMount(monaco) {
    monaco.editor.defineTheme('tomorrow-night-eighties', theme)
    monaco.editor.setTheme('tomorrow-night-eighties')
  }
  skipEffect() {
    const { acc, env } = this.props
    this.props.reset()
    acc.queue.unshift()
    env.fx.resume(env, acc, acc)
  }

  retryEvent() {
    const { env, acc } = this.props
    this.props.reset()
    env.fx.dispatch(env, acc.events[0])
  }

  retryEventWith(event) {
    const { env } = this.props
    this.props.reset()
    env.fx.dispatch(env, event)
  }

  // code editing
  toggleEdit(k, value) {
    const editing = this.state[k]
    if (editing) {
      this.setState({ editing: { [k]: null } })
      return
    }
    this.setState({
      editing: { [k]: { value } }
    }, () => {
      this.editEventRef.current.editor.focus()
      this.editEventRef.current.editor.setPosition({ lineNumber: 1, column: 100 })
    })
  }

  render() {
    if (!this.props.error) return null
    const { error, acc, env } = this.props
    const { queue, stack, events, reductions } = acc

    const caughtEffect = queue[0]
    const nextEffects = queue.slice(1)
    const doneEffects = stack
    const accumState = acc.state.db
    const originatingEvent = events[0]
    const caughtEvent = events[events.length - 1]
    const { message, suggestions, expected, received } = error.data
    const hasExpectedReceived = error.data.hasOwnProperty('expected')
                                || error.data.hasOwnProperty('received')

    const { editing } = this.state


    return <div style={{
      position: 'absolute',
      width: '100vw',
      height: '100vh',
      top: 0, left: 0,
      color: '#fff',
      background: '#333',
      overflow: 'scroll',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{
        maxWidth: 964,
        minWidth: 300,
        paddingTop: '5vh',
        paddingLeft: '4.5vw',
        paddingRight: '4.5vw'
      }}>
        <h1 style={{ textAlign: 'center' }}>{error.type}</h1>

        {message && <h2 style={{ textAlign: 'center' }}>{message}</h2>}

        <div style={{ paddingTop: 15 }} />

        {caughtEvent && <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3>Event</h3>
            <div style={{ display: 'flex' }}>
              {editing['event']
               ?
               <>
                 <ActionButton
                   onClick={() => {
                     this.setState({ editing: { ['event']: null } })
                   }}>
                   Cancel
                 </ActionButton>
                 <ActionButton
                   style={{ marginLeft: 15 }}
                   onClick={() => {
                     this.retryEventWith(JSON.parse(editing['event'].value))
                     this.setState({ editing: { ['event']: null } })
                   }}>
                   Run
                 </ActionButton>
               </>
               :
               <ActionButton
                 onClick={() => this.toggleEdit('event', prettyStr(caughtEvent))}>
                 Edit
               </ActionButton>
              }
              <ActionButton
                style={{ marginLeft: 15 }}
                onClick={this.retryEvent.bind(this)}>
                Retry
              </ActionButton>
            </div>
          </div>

          {editing['event']
           && (
             <div>
               <MonacoEditor
                 ref={this.editEventRef}
                 value={editing['event'].value}
                 options={{lineNumbers:'off',fontSize:16,minimap:{enabled:false}}}
                 theme={'tomorrow-night-eighties'}
                 language={'javascript'}
                 height={300}
                 editorWillMount={this.editorWillMount.bind(this)}
                 onChange={
                   value => this.setState({
                     editing: { ['event']: { value } } })}
               />
               <button onClick={() => {
                 this.retryEventWith(JSON.parse(editing['event'].value))
                 this.setState({ editing: { ['event']: null } })
               }}>Retry
               </button>
             </div>
           )
          }
          <CodeBlock>{prettyStr(caughtEvent)}</CodeBlock>
        </div>}

        {suggestions && <Suggestions {...{ suggestions }} />}

        {hasExpectedReceived && <div>
          <h3>Expected:</h3>
          <CodeBlock>{expected}</CodeBlock>
          <h3>Received:</h3>
          <CodeBlock>{prettyStr(received)}</CodeBlock>
        </div>}

        {caughtEffect && <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <H3>Paused on effect:</H3>
            <div style={{ display: 'flex' }}>
              <ActionButton onClick={this.skipEffect.bind(this)}>Skip</ActionButton>
            </div>
          </div>
          <CodeBlock>{prettyStr(caughtEffect)}</CodeBlock>
        </div>}

        {nextEffects.length > 0 &&
         <div>
           <h3>Next effects:</h3>
           <CodeBlock>{prettyStr(nextEffects)}</CodeBlock>
         </div>
        }

        {doneEffects.length > 0 &&
         <div>
           <h3>Effects performed: </h3>
           <CodeBlock>{prettyStr(doneEffects)}</CodeBlock>
         </div>
        }

        {reductions.length > 0 &&
         <div>
           <h3>State transformations:</h3>
           <CodeBlock>{prettyStr(reductions)}</CodeBlock>
         </div>
        }

        {reductions.length > 0 &&
         <div>
           <h3>Accumulated state</h3>
           <CodeBlock>{prettyStr(accumState)}</CodeBlock>
         </div>
        }

        <div>
          <h3>Current state value</h3>
          <CodeBlock>{prettyStr(env.state.db)}</CodeBlock>
        </div>

        <div style={{ paddingTop: 15 }} />

        <CodeBlock>
          {this.props.error.stack}
        </CodeBlock>
      </div>

    </div>
  }
}
