/* Separate, less nested version for use with component wrapper (pure render functions only)*/
import React, { Component } from 'react'
import { subs, Context } from './context'
import { shallowEqual } from './util'

const connectFn = (name, config, renderFn) => {
  let { devTools, debug, subscribe, makeSubscribe } = config
  let selector = subscribe

  class SyntheticComponentBasedOnRenderFunction extends Component {
    static displayName = name

    shouldComponentUpdate(newProps) {
      // new props are only received if shallow equality already failed
      return this.props._v !== newProps._v
    }

    render() {
      debug && console.log('component RENDER:', name, this.props)
      return renderFn(this.props)
    }
  }

  return class QuickSubscribe extends Component {

    static displayName = `ConnectedComponent(${name})`
    _sub = {
      ownProps: null,
      extractedProps: null,
      appState: null,
      merged: null,
      v: 0,
    }

    /* FOR DEBUGGING INSTRUMENTATION WE CAN TRACK ACTIVE SUBSCRIPTIONS */
    componentDidMount() {
      if (!debug && !devTools) return
      subs[name] = subs[name] || []
      subs[name].push(this._sub)
    }

    componentWillUnmount() {
      if (!debug && !devTools) return
      const i = subs[name].indexOf(this._sub)
      // console.log('Removing sub watcher', {subs,name, i})
      subs[name].splice(i, 1)
    }

    /* END SUBSCRIPTION TRACKING */

    /* TODO: we may have to handle props changes more efficiently using sCU & cWRP
     * if the innerConsumerRender gets called a bunch. So far, no sign that is the case
     */

    innerConsumerRender = ({ appState }) => {
      const didAppStateChange = appState !== this._sub.appState
      let didOwnPropsChange = !shallowEqual(this.props, this._sub.ownProps)
      let didExtractedPropsChange = false
      if (didAppStateChange) {
        selector = (() => {
          if (subscribe) return subscribe
          if (!selector) return makeSubscribe(null, this.props, null)
          if (didOwnPropsChange) return makeSubscribe(this._sub.ownProps, this.props, selector)
          return selector
        })()
        const newExtractedProps = selector(appState)
        didExtractedPropsChange = !shallowEqual(this._sub.extractedProps, newExtractedProps)
        this._sub.extractedProps = newExtractedProps
      }
      if (didOwnPropsChange) {
        this._sub.ownProps = this.props
      }
      if (didOwnPropsChange || didExtractedPropsChange) {
        this._sub.v++
        this._sub.merged = Object.assign({}, this.props, this._sub.extractedProps, { _v: this._sub.v })
      }
      debug && console.log('component CHECK:', name, {
        version: this._sub.v,
        didChange: didOwnPropsChange || didExtractedPropsChange,
        didOwnPropsChange,
        didExtractedPropsChange,
      })
      return <SyntheticComponentBasedOnRenderFunction {...this._sub.merged} />
    }

    render() {
      return (
        <Context.Consumer>
          {this.innerConsumerRender}
        </Context.Consumer>
      )
    }
  }
}


export const component = (name, mapStateOrConfigBag, renderFn) => {
  if (renderFn == null) {
    renderFn = mapStateOrConfigBag
    mapStateOrConfigBag = {}
  }
  if (typeof(renderFn) !== 'function') {
    throw new Error('This component wrapper is for pure functional components only.')
  }
  const explicitConfig = typeof(mapStateOrConfigBag) === 'function'
                         ? { subscribe: mapStateOrConfigBag }
                         : mapStateOrConfigBag

  // apply defaults
  const config = Object.assign({}, {
    skipProps: [],
  }, explicitConfig)

  const { makeSubscribe, subscribe, propsHash, compareProps } = config

  // connected component
  if (makeSubscribe || subscribe) return connectFn(name, config, renderFn)

  // Not connected so make just pure-render (which uses a shallow compare)
  return class Pure extends React.PureComponent {
    static displayName = name

    render() {
      return renderFn(this.props)
    }
  }

}
