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
  const setState = (action, state, args) => {
    // subscriptions.forEach(fn => fn(action, state, args))
    self.setState(state, () => initializedMiddlewares.forEach(m => m(action, args)))
  }

  const eventFx = {}
  const regEventFx = (type, fn) => eventFx[type] = [...eventFx[type] || [], fn]

  const fx = {}
  const regFx = (type, fn) => fx[type] = fn

  let eventQueue = []
  const dispatch = (...args) => {
    eventQueue.push(args)
    if (eventQueue.length > 1) {
      //recursing so just let it pile up in the queue...
      return
    }
    // if (eventQueue.length > MAX_DEPTH) {
    //   throw new Error('Too many recursive calls to dispatch. Did you accidentally call it on render? Example: <button onClick={dispatch(\'increment\', 5)}>Inc</button>')
    // }

    //drain the actions. Children that dispatch more actions will be drained in this same cycle
    while (eventQueue.length > 0) {
      const event = eventQueue[0]
      const [type] = eventQueue[0]
      /* reframe only allows one handler I learned -- but I like extending event handlers elsewhere so multiple it is */
      const eventHandlers = eventFx[type]
      if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)
      eventHandlers.forEach(handler => {
        const coeffects = { db: getState() }
        console.log('calling handler with', coeffects, event)
        const effects = handler(coeffects, event)
        Object.entries(effects).forEach(([key, value]) => {
          const effect = fx [key]
          console.log('processing effect', key, value)
          if (!effect) throw new Error(`No fx handler for effect "${type}". Try registering a handler using "regFx('${type}', ({ effect }) => ({...some side-effect})"`)
          effect(value, event) // event passed just for redux middleware
          // no need really to handle result of effect for now - we're not doing anything with promises for instance
        })
      })
      eventQueue.shift()
    }
  }

  regFx('db', (state, event) => {
    console.log('setting state to', state)
    setState(event, state)
  })
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
    connect,
    // subscribe,
    regEventFx,
  }
}
