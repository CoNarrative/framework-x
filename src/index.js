import React, { Component, PureComponent, createContext } from 'react'

const err = () => console.error('Provider is not initialized yet')

class Prevent extends PureComponent {
  render() {
    const { _children, ...rest } = this.props;
    return _children()(rest)
  }
}

const MAX_DEPTH = 30
export const initStore = (store, ...middlewares) => {
  let self, initializedMiddlewares
  // let subscriptions = []
  const Context = createContext()

  const getState = () => (self ? self.state : err())
  const setState = (state, [type, payload]) => {
    // subscriptions.forEach(fn => fn(action, state, args))
    console.log(`    set db from event (${type})  before:`, getState(), 'will be:', state)
    self.setState(state, () => initializedMiddlewares.forEach(m => m(type, payload)))
  }

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
    scheduleDispatchProcessing()
  }

  regFx('db', setState)
  regFx('dispatch', dispatch)

  class Subscriber extends Component {
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
      <Subscriber selector={selector}>
        {injectedProps => <WrappedComponent {...props} {...injectedProps} />}
      </Subscriber>
    ConnectComponent.displayName = `Connect(${WrappedComponent.displayName
                                              || WrappedComponent.name || 'Unknown'})`
    return ConnectComponent
  }

  class Provider extends Component {
    constructor() {
      super()
      self = this
      this.state = store.initialState
      initializedMiddlewares = middlewares.map(m => m(store, self, {}))
      this.value = { state: this.state }
    }

    componentWillMount() {
      dispatch('initialize')
    }

    render() {
      if (this.state !== this.value.state) {
        // If state was changed then recreate `this.value` so it will have a different reference
        // Explained here: https://reactjs.org/docs/context.html#caveats
        this.value = { state: this.state }
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

  return {
    Provider,
    Subscriber,
    dispatch,
    getState,
    // setState,
    connect,
    // subscribe,
    regEventFx,
    regFx,
  }
}

export * from './router'
