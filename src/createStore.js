// import hoistStatics from 'hoist-non-react-statics'
import React from 'react'

export const createStore = (initialState, ...middlewares) => {
  if (typeof(initialState) === 'function') {
    middlewares.unshift(initialState)
    initialState = null
  }
  const stateListeners = []
  let appState = initialState
  let initializedMiddlewares
  const subs = {}
  // let subscriptions = []

  const subscribeToState = fn => stateListeners.push(fn)

  /* State is synchronous */
  const getState = () => (appState)
  const setState = (state) => {
    appState = state
    stateListeners.forEach(fn => fn(state))
  }

  /* Hacked a bit to support redux devtools -- the only middleware we care about right now */
  initializedMiddlewares = middlewares.map(m => m({}, {
    setState(state) {
      setState(state)
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
      // console.log(`event handler (${type}-${count})`, 'current db:', coeffects.db, 'args:', args)
      const effects = handler(coeffects, type, args)
      if (!effects) return
      /* Process effects */
      Object.entries(effects).forEach(([key, value]) => {
        const effect = fx [key]
        // console.log(`  effect handler (${key}) for event (${type})`, value)
        if (!effect) throw new Error(`No fx handler for effect "${key}". Try registering a handler using "regFx('${key}', ({ effect }) => ({...some side-effect})"`)
        // NOTE: no need really to handle result of effect for now - we're not doing anything with promises for instance
        effect(value)
        // console.log('  after state=', getState())
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
      const nextState = newStateOrStateFn(getState())
      if (typeof(nextState) === 'function')
        throw new Error('db fx request was a reducer function that returned a function. ' +
                        'If you are using ramda, you probably didn\'t finish currying all the args')
      setState(newStateOrStateFn(getState()))
    } else {
      setState(newStateOrStateFn)
    }
  })
  regFx('dispatch', dispatchAsync)

  return {
    dispatch,
    getState,
    setState, //should only be used for testing
    regEventFx,
    regFx,
    subscribeToState,
  }
}
