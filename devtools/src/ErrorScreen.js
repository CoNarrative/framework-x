import React from 'react'
import MonacoEditor from 'react-monaco-editor'
import { CodeBlock } from './CodeBlock'
import { prettyStr } from './util'


const H3 = ({ children }) =>
  <div style={{ fontSize: '1.17em', fontWeight: 'bold' }}>{children}</div>

const ActionButton = ({ style, onClick, children }) =>
  <div style={style} onClick={onClick}>{children}</div>

const Suggestions = ({ suggestions }) =>
  <div>
    <h3>{'Code suggestion' + (suggestions.length > 1 ? 's' : '')}:</h3>
    {suggestions.map(({ code }, i) => <CodeBlock key={i}>{code}</CodeBlock>)}
  </div>

export class ErrorScreen extends React.Component {
  state = { editing: {} }

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
              <ActionButton onClick={() => this.setState({
                editing: { 'event': { value: prettyStr(caughtEvent) } }
              })}>
                Edit
              </ActionButton>
              <ActionButton style={{ marginLeft: 15 }}
                            onClick={this.retryEvent.bind(this)}>Retry</ActionButton>
            </div>
          </div>

          {editing['event']
           && (
             <div>
               <MonacoEditor
                 value={editing['event'].value}
                 options={{lineNumbers:'off'}}
                 theme={'vs-dark'}
                 language={'javascript'}
                 height={300}
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
