// import hoistStatics from 'hoist-non-react-statics'

export const createStore = (initialState, ...middlewares) => {
  if (typeof (initialState) === 'function') {
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
  const nextState = (newStateOrReducer) => {
    if (typeof (newStateOrReducer) === 'function') {
      const myNextState = newStateOrReducer(getState())
      if (typeof (myNextState) === 'function') {
        throw new Error('db fx request was a reducer function that returned a function. ' +
                        'If you are using ramda, you probably didn\'t finish currying all the args')
      }
      return myNextState
    }
    return newStateOrReducer
  }
  const setState = (newStateOrReducer) => {
    appState = nextState(newStateOrReducer)
    stateListeners.forEach(fn => fn(appState))
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
    }
  }, {}))

  const eventFx = {}
  const checkType = (op, type) => {
    if (typeof (type) !== 'string') throw new Error(`${op} requires a string as the fx key`)
    if (type.length === 0) throw new Error(`${op} fx key cannot be a zero-length string`)
  }
  const regEventFx = (type, fn) => {
    checkType('regEventFx', type)
    eventFx[type] = [...eventFx[type] || [], fn]
  }

  const fx = {}
  const regFx = (type, fn) => {
    checkType('regEventFx', type)
    fx[type] = fn
  }

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
    const type = event[0]
    const args = event.slice(1)
    // console.log('H:', type, args)
    /* reframe only allows one handler I learned -- but I like extending event handlers elsewhere so multiple it is */
    const eventHandlers = eventFx[type]
    if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)
    let count = 0
    eventHandlers.forEach(handler => {
      const coeffects = { db: getState() }
      // console.log(`event handler (${type}-${count})`, 'current db:', coeffects.db, 'args:', args)
      const effects = handler(coeffects, ...event)
      if (!effects) return
      const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)
      /* Process effects */
      effectsList.forEach(([key, value]) => {
        const effect = fx[key]
        // console.log(`  effect handler (${key}) for event (${type})`, value)
        if (!effect) throw new Error(`No fx handler for effect "${key}". Try registering a handler using "regFx('${key}', ({ effect }) => ({...some side-effect})"`)
        // NOTE: no need really to handle result of effect for now -
        // we're not doing anything with promises for instance
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
  const dispatch = (...event) => {
    if (event[0] instanceof Array) {
      eventQueue.push(event[0])
    } else {
      eventQueue.push(event)
    }
    if (!eventQueue[eventQueue.length - 1][0]) throw new Error('Dispatch requires a valid event key')
    processNextDispatch()
  }

  const dispatchAsync = (...event) => {
    if (event[0] instanceof Array) {
      eventQueue.push(event[0])
    } else {
      eventQueue.push(event)
    }
    if (!eventQueue[eventQueue.length - 1][0]) throw new Error('Dispatch requires a valid event key')
    scheduleDispatchProcessing()
  }

  regFx('db', setState)

  /* dispatch fx should happen next tick */
  regFx('dispatch', dispatchAsync)

  return {
    dispatch,
    getState,
    setState, // for when you want to bypass the eventing
    regEventFx,
    regFx,
    subscribeToState
  }
}