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
    // when second argument is an object, it is a requirements request
    if (typeof fn === 'object') {
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
   * Satisfy a requirements bag
   * @param requirementsBag
   * @returns {{}}
   */
  const satisfy = (requirementsBag) =>
    Object.entries(requirementsBag).reduce(
      (acc, [key, [requireType, ...args]]) => {
        const supplier = reg.supplierReg[requireType]
        if (!supplier) throw new Error(`EventFx request "${requireType}" but that was not registered using regSupplier`)
        return { ...acc, [key]: supplier.apply(null, args) }
      }, {}
    )

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
    // fixme. Should probably just align supply with recording of events
    // to make the whole thing simpler.
    return eventHandlers.reduce(
      (acc, [requires, handler]) => {
        const needsSuppliers = requires && Object.keys(requires).length > 0 ? 1 : 0
        if (needsSuppliers) {
          // console.log('ASKED for dependencies!', requires)
          acc = Object.assign({}, acc, { requires: [...acc.requires, requires] })
        }
        /* once we get to a position where we need more than we are supplied, we exit! */
        if (acc.requires.length > acc.supplied.length) {
          return acc
        }
        let context = {
          db: acc.db,
          eventType: type
          // fixme. Dynamically add helpers, etc.
        }
        if (needsSuppliers) {
          const thisBag = acc.supplied[acc.supplyIndex || 0]
          Object.assign(context, thisBag)
        }
        const fx = handler(context, payload)
        acc = Object.assign({}, acc, {
          lastEventType: type
        }, needsSuppliers
          ? { supplyIndex: (acc.supplyIndex || 0) + 1 } : {})
        return reduceFx(acc, fx)
      },
      acc
    )
  }

  /**
   * IMPURE version that satisfies dynamic input values but does
   * not execute side-effects.
   * Keeps asking ordinary reduceDispatch for next state and supplies required "impurities"
   * (ids, dates, local storage, etc.) until all are supplied
   * */
  const reduceDispatchSupply = (type, payload) => {
    let loop = 0
    let supplied = []
    let result = null
    let insufficient = false
    // a loop seems natural as this is an unknown number of iterations
    do {
      result = reduceDispatchStateless({
        db,
        requires: [],
        supplied,
        afterFx: []
      }, [type, payload])
      insufficient = result.requires.length > result.supplied.length
      if (insufficient) {
        const needToSupply = result.requires.slice(result.supplied.length, result.requires.length)
        supplied = needToSupply.reduce((acc, block) => {
          const thisBag = satisfy(block)
          return [...acc, thisBag]
        }, result.supplied)
        loop++
      }
    } while (loop < 32 && insufficient)
    return result
  }

  /**
   * dispatch reduce and execute side effects
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
    const result = reduceDispatchSupply(type, payload)
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

  /**
   * dispatch and receive new db and instructions
   *
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
    reduceDispatchStateless,
    reduceDispatch,
    reduceDispatchSupply,
    getDispatchDepth,
    regSupplier,
    regAfter
  }
}
