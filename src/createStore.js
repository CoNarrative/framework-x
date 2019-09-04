// import hoistStatics from 'hoist-non-react-statics'

export const identityEnv = () => ({
  context: { db: {} },
  fx: {},
  eventFx: {},
  // subs: [],  //todo. @mike was this being used for devtools?
  dbListeners: [],
  eventListeners: [],
})

export const createStore = ({
  context = { db: {} },
  fx = {},
  eventFx = {},
  dbListeners = [],
  eventListeners = []
} = {}) => {
  // context: "the circumstances that form the setting for an event, statement, or idea,
  // and in terms of which it can be fully understood and assessed."

  // environment: en·vi·ron·ment
  // /inˈvīrənmənt/
  // noun
  // noun: environment; plural noun: environments; noun: the environment
  // 1. the surroundings or conditions in which a person, animal, or plant lives or operates.
  // synonyms:	habitat, territory, domain, home, abode;
  // - the setting or conditions in which a particular activity is carried on.
  //   "a good learning environment"
  // synonyms:	situation, setting, milieu, medium, background, backdrop, scene, scenario, location, locale, context, framework; More
  // COMPUTING
  // - the overall structure within which a user, computer, or program operates.
  //   "a desktop development environment"
  // 2. the natural world, as a whole or in a particular geographical area,
  // especially as affected by human activity.

  const env = Object.assign({}, identityEnv(), {
    context,
    fx,
    eventFx,
    dbListeners,
    eventListeners
  })

  let { db } = env.context

  /* State is synchronous */
  const getState = () => db
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
    db = nextState(newStateOrReducer)
    if (dispatchDepth > 0) {
      stateIsDirty = true
      return
    }
    env.dbListeners.forEach(fn => fn(db))
  }

  /* Hacked a bit to support redux devtools -- the only middleware we care about right now */
  let initializedEventListeners = env.eventListeners.map(m => m({}, {
    setState(state) {
      setState(state)
    },
    get subs() {
      // return subs || []
      return []
    },
    get state() {
      return db
    }
  }, {}))

  const checkType = (op, type) => {
    if (typeof (type) !== 'string') throw new Error(`${op} requires a string as the fx key`)
    if (type.length === 0) throw new Error(`${op} fx key cannot be a zero-length string`)
  }
  const regEventFx = (type, fn) => {
    checkType('regEventFx', type)
    env.eventFx[type] = [...env.eventFx[type] || [], fn]
  }

  const regFx = (type, fn) => {
    checkType('regEventFx', type)
    env.fx[type] = fn
  }

  const notifyEventListeners = (type, payload, effects,
    count) => initializedEventListeners.forEach(m => m(type, payload, effects, count))

  const processDispatch = (event) => {
    dispatchDepth = dispatchDepth + 1
    try {
      const type = event[0]
      const args = event.slice(1)
      // console.log('H:', type, args)
      /* reframe only allows one handler I learned -- but I like extending event handlers elsewhere so multiple it is */
      const eventHandlers = env.eventFx[type]
      if (!eventHandlers) throw new Error(`No event fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`)
      let count = 0
      eventHandlers.forEach(handler => {
        // todo. provide other realized stateful ctx.context values (like `db`) to eventFx
        // There's two main options I see: context should be a function that
        // returns a value i.e. getState or a value.
        // We know eventFx should receive values only, but are they be computed from

        const coeffects = { db: getState(), eventType: type }
        // console.log(`event handler (${type}-${count})`, 'current db:', coeffects.db, 'args:', args)
        const effects = handler(coeffects, ...args)
        if (!effects) return
        const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)
        /* Process effects */
        effectsList.forEach(([key, value]) => {
          const effect = env.fx[key]
          // console.log(`  effect handler (${key}) for event (${type})`, value)
          if (!effect) throw new Error(`No fx handler for effect "${key}". Try registering a handler using "regFx('${key}', ({ effect }) => ({...some side-effect})"`)
          // NOTE: no need really to handle result of effect for now -
          const fxContext = { db }
          effect(fxContext, value)
        })
        // only notify if at root, and notify once per handler
        if (dispatchDepth === 1) {
          notifyEventListeners(type, args, effects, count)
          count++
        }
      })
    } finally {
      dispatchDepth = dispatchDepth - 1
      // defer notification until all done with root dispatch
      if (dispatchDepth === 0 && stateIsDirty) {
        env.dbListeners.forEach(fn => fn(db))
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

  const subscribeToState = fn => env.dbListeners.push(fn)

  return {
    env: Object.freeze(env),
    dispatch,
    getState,
    setState, // for when you want to bypass the eventing
    regEventFx,
    regFx,
    subscribeToState
  }
}
