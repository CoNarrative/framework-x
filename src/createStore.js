// import hoistStatics from 'hoist-non-react-statics'
import React, { Component, createContext, PureComponent } from 'react'
import { shallowEqual } from './util'

export const initStore = (...middlewares) => {
  let self
  let appState = null
  let initializedMiddlewares
  const subs = {}
  // let subscriptions = []
  const Context = createContext()

  // if the provider is not yet rendered, app state comes from the store objection
  const getState = () => (self ? self.state.appState : appState)
  const setState = (state) => {
    // subscriptions.forEach(fn => fn(action, state, args))
    // console.log(`    set db from event (${type})  before:`, getState(), 'will be:', state)
    if (self) {
      appState = state
      // self.setState({ appState: state },
      //   () => initializedMiddlewares.forEach(m => m(type, payload)))
      self.setState({ appState: state })
    } else {
      // Provider not yet ready
      appState = state
    }
  }

  /* Hacked a bit to support redux devtools -- the only middlware we care about */
  initializedMiddlewares = middlewares.map(m => m({}, {
    setState() {
      throw new Error('Not supported.')
    },
    get subs() {
      return subs || []
    },
    get state() {
      return appState
    },
  }, {}))

  const eventFx = {}
  const regEventFx = (type, fn) => eventFx[type] = [...eventFx[type] || [], fn]

  const fx = {}
  const regFx = (type, fn) => fx[type] = fn

  let eventQueue = []

  let dispatchScheduled = false
  const scheduleDispatchProcessing = () => {
    if (dispatchScheduled) return // no need, already scheduled
    dispatchScheduled = true
    setTimeout(processNextDispatch, 1)
  }

  const notifyMiddlewares = (type, payload, effects,
    count) => initializedMiddlewares.forEach(m => m(type, payload, effects, count))

  const processNextDispatch = () => {
    dispatchScheduled = false
    if (eventQueue.length === 0) return
    const event = eventQueue.shift()
    const [type, args] = event
    // console.log('H:', type, args)
    /* reframe only allows one handler I learned -- but I like extending event handlers elsewhere so multiple it is */
    const eventHandlers = eventFx[type]
    if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)
    let count = 0
    eventHandlers.forEach(handler => {
      const coeffects = { db: getState() }
      // console.log(`event handler (${type})`, 'current db:', coeffects.db, 'args:', args)
      const effects = handler(coeffects, type, args)
      if (!effects) return
      Object.entries(effects).forEach(([key, value]) => {
        const effect = fx [key]
        // console.log(`  effect handler (${key}) for event (${type})`, value)
        if (!effect) throw new Error(`No fx handler for effect "${key}". Try registering a handler using "regFx('${key}', ({ effect }) => ({...some side-effect})"`)
        // NOTE: no need really to handle result of effect for now - we're not doing anything with promises for instance
        effect(value)
      })
      notifyMiddlewares(type, args, effects, count)
      count++
    })
    if (eventQueue.length > 0) {
      scheduleDispatchProcessing()
    }
  }

  /* All dispatches are drained async */
  const dispatch = (type, payload) => {
    eventQueue.push([type, payload])
    processNextDispatch()
  }

  const dispatchAsync = (type, payload) => {
    eventQueue.push([type, payload])
    scheduleDispatchProcessing()
  }

  regFx('db', (newStateOrStateFn) => {
    // console.log('---db-', newStateOrStateFn)
    if (typeof(newStateOrStateFn) === 'function') {
      setState(newStateOrStateFn(getState()))
    } else {
      setState(newStateOrStateFn)
    }
  })
  regFx('dispatch', dispatchAsync)

  class Provider extends Component {
    constructor() {
      super()
      self = this
      // by making appState a child of state, we make sure the full state gets overwritten
      // instead of the weird setState merge effect
      this.state = { appState }
      this.value = { appState: this.getAppState() }
    }

    getAppState() {
      return this.state.appState
    }

    render() {
      if (this.getAppState() !== this.value.state) {
        // If state was changed then recreate `this.value` so it will have a different reference
        // Explained here: https://reactjs.org/docs/context.html#caveats
        this.value = { appState: this.getAppState() }
      }
      return (
        <Context.Provider
          value={this.value}
        >
          {this.props.children}
        </Context.Provider>
      )
    }
  }

  /* SET UP COMPONENT FUNCTIONS - original */
  const getNonChildProps = props => {
    const otherProps = Object.assign({}, props)
    delete otherProps.children
    return otherProps
  }

  class Prevent extends PureComponent {
    render() {
      const { _children, ...rest } = this.props;
      return _children()(rest)
    }
  }

  class Subscribe extends Component {
    // We do this so the shouldComponentUpdate of Prevent will ignore the children prop
    _children = () => this.props.children
    prevent = ({ appState }) => {
      const { otherProps, selector } = this.props
      return (
        <Prevent {...selector(appState)}
                 {...otherProps}
                 _children={this._children} />
      )
    }

    render() {
      return (
        <Context.Consumer>
          {this.prevent}
        </Context.Consumer>
      )
    }
  }

  const connect = selector => WrappedComponent => {
    const ConnectedComponent = (props) => {
      return <Subscribe selector={selector} otherProps={getNonChildProps(props)}>
        {injectedProps => <WrappedComponent {...props} {...injectedProps} />}
      </Subscribe>
    }
    ConnectedComponent.displayName = `Connect(${WrappedComponent.displayName
                                                || WrappedComponent.name || '-'})`
    return ConnectedComponent
  }

  /* ---NEW SCHOOL--- */
  /* Separate, less nested version for use with component wrapper (pure render functions only)*/
  const connectFn = (name, config, renderFn) => {
    let { devTools, debug, skipProps, subscribe, makeSubscribe } = config
    let selector = subscribe

    class Synthetic extends Component {
      static displayName = name

      shouldComponentUpdate(newProps) {
        // new props are only received if shallow equality already failed
        // console.log('sCU', this.props._v, newProps._v,
        //   'shouldComponentUpdate=', this.props._v !== newProps._v)
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

      /* TODO: we may have to handle props changes more efficiently using willReceiveProps
       * if the innerConsumerRender gets called a bunch. So far, no sign that is the case
       */
      // componentWillReceiveProps(nextProps) {
      // }
      // shouldComponentUpdate(nextProps) {
      // }

      innerConsumerRender = ({ appState }) => {
        const didAppStateChange = appState !== this._sub.appState
        let didOwnPropsChange = !shallowEqual(this.props, this._sub.ownProps)
        let didExtractedPropsChange = false
        if (didAppStateChange) {
          selector = (() => {
            if (subscribe) return subscribe
            if (!selector) return makeSubscribe(null, this.props)
            if (didOwnPropsChange) return makeSubscribe(this._sub.ownProps, this.props)
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
        return <Synthetic {...this._sub.merged} />
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


  const component = (name, mapStateOrConfigBag, renderFn) => {
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

  return {
    Provider,
    Subscribe,
    dispatch,
    getState,
    component,
    regEventFx,
    regFx,
    connect,
  }
}
