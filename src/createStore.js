const nextDb = (db, newStateOrReducer) => {
  if (typeof (newStateOrReducer) === 'function') {
    const myNextState = newStateOrReducer(db)
    if (typeof (myNextState) === 'function') {
      throw new Error('db fx request was a reducer function that returned a function. ' +
                      'If you are using ramda, you probably didn\'t finish currying all the args')
    }
    return myNextState
  }
  return newStateOrReducer
}

function checkType(op, type) {
  if (typeof (type) !== 'string') throw new Error(`${op} requires a string as the fx key`)
  if (type.length === 0) throw new Error(`${op} fx key cannot be a zero-length string`)
}

/**
 * Create a store (logic plus state)
 * @param baseReg registrations from another store so this can be a functional clone
 * @param initialState initial state defaults to {}
 * @returns {{notifyState: (function(*=): void), regFxReducer: regFxReducer, regEventFx: regEventFx, dispatch: dispatch, getState: (function(): *), regFx: regFx, def: {regFxReducer, regEventFx, regFx, def}, stateListeners: Array, setState: setState, subscribeToState: (function(*=): number)}}
 */
export const createStore = (baseReg, initialState = {}) => {
  /* registrations -- these can be passed to new stores */
  const reg = baseReg ? Object.assign({}, baseReg) : {
    fxReg: {},
    eventFxReg: {},
    supplierReg: {},
    afterReg: []
  }

  /**
   * Underlying reducer that participates in reduceDispatch
   * can return more fx requests now
   * @param fxType
   * @param reduce (reg, acc, payload)
   */
  const regFxImmediate = (fxType, reducer) => {
    checkType('regFxImmediate', fxType)
    reg.fxReg[fxType] = reducer
  }

  /**
   * Normal fx signature
   * @param fxType
   * @param perform
   */
  const regFx = (fxType, standardFxr) => {
    checkType('regFx', fxType)
    // defer until later, and ignore anything it returns
    const reducer = (acc, [type, payload]) =>
      Object.assign({}, acc, { afterFx: acc.afterFx.concat(() => standardFxr(acc, payload)) })
    reg.fxReg[fxType] = reducer
  }

  const regEventFx = (type, fn, fn2) => {
    let requires = []
    if (Array.isArray(fn)) {
      requires = fn
      fn = fn2
    }
    // todo: add type as array or function signatures
    checkType('regEventFx', type)
    // we allow multiple event fx for one event name
    reg.eventFxReg[type] = [...reg.eventFxReg[type] || [], [requires, fn]]
  }

  const regSupplier = (type, supplierFn) => {
    checkType('regSupplier', type)
    reg.supplierReg[type] = supplierFn
  }

  const regAfter = (afterFn) => {
    reg.afterReg = [...reg.afterReg, afterFn]
  }

  /* state definition */
  const stateListeners = []
  let db = initialState

  // used to guard calls to setState
  let dispatchDepth = 0

  const getDispatchDepth = () => dispatchDepth
  const subscribeToState = fn => stateListeners.push(fn)
  const notifyState = db => stateListeners.forEach(fn => fn(db))

  const getState = () => db
  const setState = nextDb => {
    if (dispatchDepth > 0) {
      console.warn('Do not call setState from an eventFx. In an fx, you can just return db fx')
    }
    db = nextDb
    notifyState(db)
  }

  /**
   * Takes a list of effects and reduces them.
   * Fxrs (fx handlers) can return more fx which are executed inline
   * @param acc
   * @param effects
   * @returns {*}
   */
  function reduceFx(acc, effects) {
    if (!effects) return acc
    // Accepts either map or array
    const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)
    // Process IMMEDIATE effects by reducing over them
    return effectsList.reduce(
      (acc, [fxType, fxPayload]) => {
        const fxr = reg.fxReg[fxType]
        if (!fxr) {
          throw new Error(`No fx handler for effect "${fxType}". Try registering a handler using "regFx('${fxType}', ({ effect }) => ({...some side-effect})"`)
        }
        const nextAcc = fxr(acc, fxPayload)
        // console.log('NEXT ACC', nextAcc)
        return nextAcc
      },
      acc
    )
  }

  /**
   * A dispatch as a pure function that invokes all of the supplied helpers in the reg
   * to produce a resultant {db, fx} bag
   * @param acc {db:{}, fx:{}}
   * @param type
   * @param payload
   * @returns {(function(*=, *=): function(*=, *=): *)|*}
   */
  function reduceDispatchStateless(
    acc,
    [type, payload] // fixme. Alex wants this to be the old ...event, signature to permit argument spreading
  ) {
    if (typeof type !== 'string') {
      throw new Error('attempted to dispatch empty or invalid type argument')
    }
    const eventHandlers = reg.eventFxReg[type]
    if (!eventHandlers) {
      const message = `No event -> fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`
      if (reg.onMissingHandler === 'ignore') {
        // do nothing
      } else if (reg.onMissingHandler === 'warn') {
        console.warn(message)
      } else {
        throw new Error(message)
      }
    }
    return eventHandlers.reduce(
      (acc, [requires, handler]) => {
        const prevRequiredLength = acc.requires.length
        if (requires.length > 0) {
          // console.log('ASKED for dependencies!', requires)
          acc = Object.assign({}, acc, { requires: [...acc.requires, ...requires] })
        }
        /* once we get to a position where we need more than we are supplied, we are out! */
        if (acc.requires.length > acc.supplied.length) {
          return acc
        }
        const supplied = acc.supplied.slice(prevRequiredLength, requires.length)
        const context = {
          db: acc.db,
          eventType: type,
          supplied
          // fixme. Dynamically add helpers, etc.
        }
        acc = Object.assign({}, acc, { lastEventType: type })
        const fx = handler(context, payload)
        return reduceFx(acc, fx) // fixme. Alex wants spread arguments
      },
      acc
    )
  }

  /**
   * dispatch and receive new db and instructions
   * @param payload
   * @returns {(function(*=, *=): function(*=, *=): *)|*}
   */
  const reduceDispatch = (type, payload) =>
    reduceDispatchStateless({
      db,
      requires: [],
      supplied: [],
      afterFx: []
    }, [type, payload])

  /**
   * dispatch and execute side effects
   * @param event
   */
  const dispatch = (...event) => {
    if (dispatchDepth > 0) {
      console.warn('Do not call dispatch from an eventFx. In an fx, you can just return dispatch fx')
    }
    const finalEvent = (event[0] instanceof Array) ? event[0] : event
    if (!event[0]) throw new Error('Dispatch requires at least a valid event key')
    const [type, payload] = finalEvent
    dispatchDepth = dispatchDepth + 1
    let result = {
      db,
      requires: [],
      supplied: [],
      afterFx: []
    }
    let loop = 0

    /* DECIDE: loop until all impure generator / accessor value (ids, dates, local storage, etc.)
       requirements are supplied */
    do {
      const needToSupply = result.requires.slice(result.supplied.length,
        result.requires.length - result.supplied.length)
      const supplied = needToSupply.reduce((acc, [requireType, ...args]) => {
        const supplier = reg.supplierReg[requireType]
        if (!supplier) throw new Error(`EventFx request "${requireType}" but that was not registered using regSupplier`)
        return [...acc, supplier.apply(null, args)]
      }, [])
      result = reduceDispatchStateless({...result, requires: [], supplied}, [type, payload])
      loop++
    } while (loop < 32 && result.supplied.length < result.requires.length)
    dispatchDepth = dispatchDepth - 1

    /* EXECUTE side-effects */
    reg.afterReg.forEach(after => after(result, type, payload))
    result.afterFx.forEach(after => after())
  }

  // These two are core so we always have these. They can be overridden as desired.
  regFxImmediate('db', (acc, newStateOrReducer) =>
    Object.assign({}, acc, { db: nextDb(acc.db, newStateOrReducer), stateIsDirty: true })
  )
  regFxImmediate('dispatch', reduceDispatchStateless)
  regAfter((result) => {
    if (result.stateIsDirty) {
      setState(result.db)
    }
  })

  return {
    reg,
    stateListeners,
    dispatch,
    getState,
    setState,
    notifyState,
    regEventFx,
    regFx,
    regFxImmediate,
    subscribeToState,
    reduceDispatch,
    reduceDispatchStateless,
    getDispatchDepth,
    regSupplier,
    regAfter
  }
}
