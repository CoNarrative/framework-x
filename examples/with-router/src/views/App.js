import { component, connect } from 'framework-x'
import React from 'react'
import { appSub, mainSub } from '../subs'
import './App.css'

const Item = component('Item', ({ id, name }) => (
  <div>
    {id}: {name}
  </div>
))

const ConnectedClass = connect(appSub)(
  class UsingConnectInner extends React.Component {
    render() {
      const { formattedCount } = this.props
      return (
        <div>
          <div>FormattedCountAgain: {formattedCount}</div>
        </div>
      )
    }
  }
)

const ConnectedClassWithOuterProp = connect(() => ({}))(
  class UsingConnectInner extends React.Component {
    render() {
      const { outsidePropCount } = this.props
      return (
        <div>
          <div>Count from outside props: {outsidePropCount}</div>
        </div>
      )
    }
  }
)

const DynamicSelector = component('AnotherThing', {
  makeSubscribe: (oldProps, newProps) => mainSub,
  debug: true
}, ({ otherwise }) => (
  <div>Foo: {otherwise ? 'Yes' : 'No'}</div>
))

const Main = component('Main', {
  subscribe: mainSub
},
({ otherwise, formattedCount }) => (
  <div>Otherwise: {otherwise ? 'true' : 'false'} {formattedCount}</div>
))

const UnconnectedButton = component('UnconnectedButton', { injectDispatch: true },
  ({ dispatch }) => (
    <button
      onClick={() => dispatch('otherwise')}
    >
      Otherwise
    </button>
  ))

const App = component('App', {
  subscribe: appSub,
  devTools: true
},
({ dispatch, formattedCount }) => (
  <div>
    <div>{formattedCount}</div>
    <button
      onClick={() => dispatch('increment', 5)}
    >
        Increment
    </button>
    <UnconnectedButton />
    <Item id={0} name='Hello' />
    <Main id={1} formattedCount={formattedCount} />
    <Main id={2} />
    {/* <UsingConnect/> */}
    <ConnectedClassWithOuterProp outsidePropCount={formattedCount} />
    <DynamicSelector />
  </div>
)
)

export default App