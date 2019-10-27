import React  from 'react'
import { Context } from './context'

const hasOwn = Object.prototype.hasOwnProperty
function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

export function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }
  return true
}
const connectFn = (name, config, renderFn) => {
  let { devTools, debug, subscribe, makeSubscribe } = config
  let selector = subscribe

  class SyntheticComponentBasedOnRenderFunction extends React.Component {
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

  return class ComponentSubscriptionWrapper extends React.Component {
    static displayName = `FxComponent(${name})`
    _sub = {
      ownProps: null,
      extractedProps: null,
      appState: null,
      merged: null,
      v: 0
    }

    /*
     * The render function is called whenever it receives new props or when it receives new
     * This goes counter to normal React in which a sCU checks first before hitting the render function
     * There appears to be no problem; but if I'm wrong we may possibly have to handle props changes more efficiently using sCU & cWRP
     */

    innerConsumerRender = (consumerValue) => {
      if (consumerValue == null) {
        throw new Error(`Framework-x component "${name}" did not receive a store from Provider context`)
      }
      const { appState, dispatch } = consumerValue
      if (!appState) throw new Error('App state was not initialized before rendering component.')
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
        const newExtractedProps = selector(appState, this.props)
        didExtractedPropsChange = !shallowEqual(this._sub.extractedProps, newExtractedProps)
        this._sub.extractedProps = newExtractedProps
      }
      if (didOwnPropsChange) {
        this._sub.ownProps = this.props
      }
      if (didOwnPropsChange || didExtractedPropsChange) {
        this._sub.v++
        this._sub.merged = Object.assign({ dispatch }, this.props, this._sub.extractedProps, { _v: this._sub.v })
      }

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
  if (typeof (renderFn) !== 'function') {
    throw new Error('This component wrapper is for pure functional components only.')
  }
  const explicitConfig = typeof (mapStateOrConfigBag) === 'function'
                         ? { subscribe: mapStateOrConfigBag }
                         : mapStateOrConfigBag

  // apply defaults
  const config = Object.assign({}, {
    skipProps: []
  }, explicitConfig)

  const { makeSubscribe, subscribe } = config

  // convert classes to render fns
  renderFn = (renderFn.prototype && renderFn.prototype.isReactComponent)
             ? props => React.createElement(renderFn, props) : renderFn

  // connected component
  if (makeSubscribe || subscribe) return connectFn(name, config, renderFn)

  // Not connected so make just pure-render (which uses a shallow compare)
  if (config.injectDispatch) {
    return class Pure extends React.PureComponent {
      static displayName = name

      render() {
        return (
          <Context.Consumer>
            {({ dispatch }) => renderFn(Object.assign({ dispatch }, this.props))}
          </Context.Consumer>
        )
      }
    }
  }
  return class Pure extends React.PureComponent {
    static displayName = name

    render() {
      return renderFn(this.props)
    }
  }
}
