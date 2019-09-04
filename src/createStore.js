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
  const fxReg = {}
  const eventFxReg = {}
  // let subscriptions = []

  const subscribeToState = fn => stateListeners.push(fn)

  /* State is synchronous */
  const getState = () => (appState)
  const nextState = (newStateOrReducer) => {
    if (typeof (newStateOrReducer) === 'function') {
      const myNextState = newStateOrReducer(getState())
      if (typeof (myNextState) === 'function') {
        throw new Error('db fxReg request was a reducer function that returned a function. ' +
                        'If you are using ramda, you probably didn\'t finish currying all the args')
      }
      return myNextState
    }
    return newStateOrReducer
  }

  let dispatchDepth = 0
  let stateIsDirty = false
  const setState = (newStateOrReducer) => {
    appState = nextState(newStateOrReducer)
    if (dispatchDepth > 0) {
      stateIsDirty = true
      return
    }
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

  const checkType = (op, type) => {
    if (typeof (type) !== 'string') throw new Error(`${op} requires a string as the fx key`)
    if (type.length === 0) throw new Error(`${op} fx key cannot be a zero-length string`)
  }
  const regEventFx = (type, fn) => {
    checkType('regEventFx', type)
    eventFxReg[type] = [...eventFxReg[type] || [], fn]
  }

  const regFx = (type, fn) => {
    checkType('regEventFx', type)
    fxReg[type] = fn
  }

  const notifyMiddlewares = (type, payload, effects,
    count) => initializedMiddlewares.forEach(m => m(type, payload, effects, count))

  const processDispatch = (event) => {
    dispatchDepth = dispatchDepth + 1
    try {
      const type = event[0]
      const args = event.slice(1)
      // console.log('H:', type, args)
      /* reframe only allows one handler I learned -- but I like extending event handlers elsewhere so multiple it is */
      const eventHandlers = eventFxReg[type]
      if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)
      let count = 0
      eventHandlers.forEach(handler => {
        const coeffects = { db: getState(), eventType: type }
        // console.log(`event handler (${type}-${count})`, 'current db:', coeffects.db, 'args:', args)
        const effects = handler(coeffects, ...args)
        if (!effects) return
        const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)
        /* Process effects */
        effectsList.forEach(([key, value]) => {
          const effect = fxReg[key]
          // console.log(`  effect handler (${key}) for event (${type})`, value)
          if (!effect) throw new Error(`No fx handler for effect "${key}". Try registering a handler using "regFx('${key}', ({ effect }) => ({...some side-effect})"`)
          // NOTE: no need really to handle result of effect for now -
          const fxContext = { db: appState }
          effect(fxContext, value)
        })
        // only notify if at root, and notify once per handler
        if (dispatchDepth === 1) {
          notifyMiddlewares(type, args, effects, count)
          count++
        }
      })
    } finally {
      dispatchDepth = dispatchDepth - 1
      // defer notification until all done with root dispatch
      if (dispatchDepth === 0 && stateIsDirty) {
        stateListeners.forEach(fn => fn(appState))
        stateIsDirty = false
      }
    }
  }

  /**
   * synchronous dispatch
   * @param event
   */
  const dispatch = (...event) => {
    const finalEvent = Array.isArray(event[0]) ? event[0] : event
    if (!finalEvent[0]) throw new Error('Dispatch requires a valid event key')
    processDispatch(finalEvent)
  }

  regFx('db', (_, dbOrReducer) => setState(dbOrReducer))

  /* dispatch fxReg should happen next tick */
  regFx('dispatch', (_, event) => dispatch(event))

  return {
    dispatch,
    getState,
    setState, // for when you want to bypass the eventing
    regEventFx,
    regFx,
    subscribeToState
  }
}
