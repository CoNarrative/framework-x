import React, { Component, PureComponent, createContext } from 'react'

const err = () => console.error('Provider is not initialized yet')

class Prevent extends PureComponent {
  render() {
    const { _children, ...rest } = this.props;
    return _children()(rest)
  }
}

class Pure extends PureComponent {
  constructor(props) {
    super(props)
    this.renderFn = props.renderFn.bind(this)
  }

  render() {
    return this.renderFn()
  }

}

const MAX_DEPTH = 30
export const initStore = (store, ...middlewares) => {
  let self
  let appState = null
  let initializedMiddlewares
  // let subscriptions = []
  const Context = createContext()

  // if the provider is not yet rendered, app state comes from the store objection
  const getState = () => (self ? self.state.appState : appState)
  const setState = (state, [type, payload]) => {
    // subscriptions.forEach(fn => fn(action, state, args))
    console.log(`    set db from event (${type})  before:`, getState(), 'will be:', state)
    if (self) {
      // Provider is ready
      self.setState({ appState: state },
        () => initializedMiddlewares.forEach(m => m(type, payload)))
    } else {
      // Provider not yet ready
      appState = state
      initializedMiddlewares.forEach(m => m(type, payload))
    }
  }

  initializedMiddlewares = middlewares.map(m => m(store, {
    setState() {
      throw new Error('Not supported.')
    },
    get state() {
      return getState()
    },
  }, {}))

  const eventFx = {}
  const regEventFx = (type, fn) => eventFx[type] = [...eventFx[type] || [], fn]

  const fx = {}
  const regFx = (type, fn) => fx[type] = fn

  let eventQueue = []
  const dispatchDrainSync = (type, payload) => {
    eventQueue.push([type, payload])
    if (eventQueue.length > 1) {
      //recursing so just let it pile up in the queue...
      return
    }
    //drain the actions. Children that dispatch more actions will be drained in this same cycle
    while (eventQueue.length > 0) {
      const event = eventQueue[0]
      const [type, args] = event
      /* reframe only allows one handler I learned -- but I like extending event handlers elsewhere so multiple it is */
      const eventHandlers = eventFx[type]
      if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)
      eventHandlers.forEach(handler => {
        const coeffects = { db: getState() }
        console.log(`event handler (${type})`, 'current db:', coeffects.db, 'args:', args)
        const effects = handler(coeffects, event)
        if (!effects) return
        Object.entries(effects).forEach(([key, value]) => {
          const effect = fx [key]
          console.log(`  effect handler (${key}) for event (${type})`, value)
          if (!effect) throw new Error(`No fx handler for effect "${type}". Try registering a handler using "regFx('${type}', ({ effect }) => ({...some side-effect})"`)
          // NOTE: no need really to handle result of effect for now - we're not doing anything with promises for instance
          effect(value, event) // event passed just for redux dev tools
        })
      })
      eventQueue.shift()
    }
  }

  let dispatchScheduled = false
  const scheduleDispatchProcessing = () => {
    if (dispatchScheduled) return // no need, already scheduled
    dispatchScheduled = true
    setTimeout(processNextDispatch, 1)
  }

  const processNextDispatch = () => {
    dispatchScheduled = false
    if (eventQueue.length === 0) return
    const event = eventQueue.shift()
    const [type, args] = event
    /* reframe only allows one handler I learned -- but I like extending event handlers elsewhere so multiple it is */
    const eventHandlers = eventFx[type]
    if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)
    eventHandlers.forEach(handler => {
      const coeffects = { db: getState() }
      console.log(`event handler (${type})`, 'current db:', coeffects.db, 'args:', args)
      const effects = handler(coeffects, event)
      if (!effects) return
      Object.entries(effects).forEach(([key, value]) => {
        const effect = fx [key]
        console.log(`  effect handler (${key}) for event (${type})`, value)
        if (!effect) throw new Error(`No fx handler for effect "${type}". Try registering a handler using "regFx('${type}', ({ effect }) => ({...some side-effect})"`)
        // NOTE: no need really to handle result of effect for now - we're not doing anything with promises for instance
        effect(value, event) // event passed just for redux dev tools
      })
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

  regFx('db', setState)
  regFx('dispatch', dispatchAsync)

  class Subscribe extends Component {
    // We do this so the sCU of Prevent will ignore the children prop
    _children = () => this.props.children

    prevent = ({ state, actions }) => {
      const { selector } = this.props
      return (
        <Prevent {...selector(state)} actions={actions}
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
    const ConnectComponent = (props) =>
      <Subscribe selector={selector}>
        {injectedProps => <WrappedComponent {...props} {...injectedProps} />}
      </Subscribe>
    ConnectComponent.displayName = `Connect(${WrappedComponent.displayName
                                              || WrappedComponent.name || 'Unknown'})`
    return ConnectComponent
  }

  class Provider extends Component {
    constructor() {
      super()
      self = this
      // by making appState a child of state, we make sure the full state gets overwritten
      // instead of the weird setState merge effect
      console.log('initializing appState with', appState)
      this.state = { appState }
      this.value = { state: this.getAppState() }
    }

    getAppState() {
      return this.state.appState
    }

    render() {
      if (this.getAppState() !== this.value.state) {
        // If state was changed then recreate `this.value` so it will have a different reference
        // Explained here: https://reactjs.org/docs/context.html#caveats
        this.value = { state: this.getAppState() }
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

  const component = (name, mapStateOrConfigBag, renderFn) => {
    if (renderFn == null) {
      renderFn = mapStateOrConfigBag
      mapStateOrConfigBag = {}
    }
    const config = typeof(mapStateOrConfigBag) === 'function'
      ? { subscribe: mapStateOrConfigBag }
      : mapStateOrConfigBag

    const { subscribe, propsHash, compareProps } = config

    // connected component
    console.log({ subscribe, name, renderFn })
    if (subscribe) return connect(subscribe)(renderFn)
    
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
  }
}
