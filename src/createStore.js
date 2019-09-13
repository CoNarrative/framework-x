const assoc = (k, v, bag) => Object.assign({}, bag, { [k]: v })
const merge = (vs, bag) => Object.assign({}, bag, vs)
const clone = o => Object.assign({}, o)

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
  const reg = baseReg ? clone(baseReg) : {
    fx: {},
    sideFx: {},
    supplierReg: {},
    beforeReg: [],
    afterReg: []
  }

  /**
   * Underlying reducer that participates in reduceDispatch
   * can return more fx requests now
   * @param fxType
   * @param reducer: (acc, payload) => ....
   */
  const regReduceFx = (fxType, reducer) => {
    checkType('regReduceFx', fxType)
    reg.fx[fxType] = reducer
  }

  const initialAcc = () => ({
    db,
    requires: [],
    supplied: [],
    sideFx: []
  })

  /**
   * Takes a single or list of effects and reduces them.
   * Fxrs (fx handlers) can return more fx which are executed inline
   * @param acc
   * @param effects Array[[type, payload]]
   * @returns {*}
   */
  function reduceFx(acc = initialAcc(), effectOrEffects) {
    if (!effectOrEffects) return acc
    // Accepts either map or array
    // const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)
    const effectsList =
      Array.isArray(effectOrEffects[0]) ? effectOrEffects : [effectOrEffects]

    // Process IMMEDIATE effects by reducing over them
    return effectsList.reduce(
      (acc, [fxType, fxPayload]) => {
        console.log(acc)
        if (acc.fault) {
          // todo: actual shortcutting reduce! Ramda has one. Would have to be loop
          return acc
        }
        const about = reg.fx[fxType]
        if (!about) {
          throw new Error(`No fx handler for effect "${fxType}". Try registering a handler using "regFx('${fxType}', ({ effect }) => ({...some side-effect})"`)
        }
        const fxr = (typeof (about) === 'function') ? about : about.fn
        return fxr(acc, fxPayload)
      },
      acc
    )
  }

  /**
   * Applies final reduction to sidefx only
   * as provided by after reducers
   * @param reduced
   * @returns {*}
   */
  const collapseToSideFx = reduced =>
    reg.afterReg.reduce((acc, after) => after(acc), reduced).sideFx

  /**
   * Helper to get a reduceFx collapsed to end
   * just like fx() but without auto-supply
   * @param type
   * @param payload
   * @returns {*}
   */
  const reduceFxToEnd = (type,
    payload) => collapseToSideFx(reduceFx(undefined, [type, payload]))

  /**
   * Composite fx defined in terms of other fx
   * (once was eventFx)
   * @param type
   * @param fn
   * @param fn2
   */
  const regFx = (type, fn, fn2) => {
    let requires = []
    // when second argument is an object, it is a requirements request
    if (typeof fn === 'object') {
      requires = fn
      fn = fn2
    }
    // todo: add type as array or function signatures
    checkType('regFx', type)

    /* Helper that focuses on what most fxrs need */
    const fxr = (acc, fxPayload) => {
      /* construct context bag */
      let context = {
        db: acc.db,
        fxType: type
        // fixme. Dynamically add static/global helpers, etc.
      }
      const needsSuppliers = requires && Object.keys(requires).length > 0 ? 1 : 0
      if (needsSuppliers) {
        // console.log('ASKED for dependencies!', requires)
        acc = Object.assign({}, acc, { requires: [...acc.requires, requires] })
      }
      if (acc.requires.length > acc.supplied.length) {
        // todo: actual shortcutting reduce! Ramda has one
        return Object.assign({}, acc, { fault: true })
      }
      if (needsSuppliers) {
        const thisBag = acc.supplied[acc.supplyIndex || 0]
        Object.assign(context, thisBag)
      }
      const fx = fn(context, fxPayload)
      acc = Object.assign({}, acc, {
        lastFxType: type
      }, needsSuppliers
         ? { supplyIndex: (acc.supplyIndex || 0) + 1 } : {})
      return reduceFx(acc, fx)
    }

    reg.fx[type] = {
      requires,
      fn: fxr
    }
  }

  /**
   * Ordinary signature for registering true side effects
   * that do not themselves feed back into plan reduction
   */
  const regSideFx = (fxType, simpleFx) => {
    checkType('regSideFx', fxType)
    const reducer = (acc, fxPayload) =>
      Object.assign({}, acc, { sideFx: acc.sideFx.concat([[fxType, fxPayload]]) })
    // just going to cheat and put the actual call in the handler so as to avoid
    // setting up another registry or modifying the simplicity of the current one
    reducer.fxr = simpleFx
    regReduceFx(fxType, reducer)
  }

  const regSupplier = (type, supplierFn) => {
    checkType('regSupplier', type)
    reg.supplierReg[type] = supplierFn
  }

  const regBefore = (id, beforeFn) => {
    reg.beforeReg = [...reg.afterReg, beforeFn]
  }
  const regAfter = (id, afterFn) => {
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
    // ignore if same
    if (nextDb === db) return
    db = nextDb
    notifyState(db)
  }

  /**
   * Satisfy a requirements bag
   * @param requirementsBag
   * @returns {{}}
   */
  const supply = (dispatchAcc, requirementsBag) =>
    Object.entries(requirementsBag).reduce(
      (acc, [key, [requireType, ...args]]) => {
        const supplier = reg.supplierReg[requireType]
        if (!supplier) throw new Error(`EventFx requested "${requireType}" that was not registered using regSupplier`)
        return { ...acc, [key]: supplier.apply(null, [dispatchAcc].concat([args])) }
      }, {}
    )
  /**
   * IMPURE version that satisfies dynamic input values but does
   * not execute side-effects.
   * Keeps asking ordinary reduceFx for next state and supplies required "impurities"
   * (ids, dates, local storage, etc.) until all are supplied
   * */
  const reduceFxSupply = (type, payload) => {
    let loop = 0
    let supplied = []
    let result = null
    let insufficient = false
    // a loop seems natural as this is an unknown number of iterations
    const createAccum = (init) => ({ requires: [], afterFx: [], ...init })
    do {
      result = reduceFx(createAccum({ db, supplied }), [[type, payload]])
      insufficient = result.requires.length > result.supplied.length
      if (insufficient) {
        const needToSupply = result.requires.slice(result.supplied.length, result.requires.length)
        supplied = needToSupply.reduce((acc, block) => {
          const thisBag = supply(result, block)
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
  const fx = (...event) => {
    if (dispatchDepth > 0) {
      console.warn('Do not call dispatch from an eventFx. In an fx, you can just return dispatch fx')
    }
    const finalEvent = (event[0] instanceof Array) ? event[0] : event
    if (!event[0]) throw new Error('Dispatch requires at least a valid event key')
    const [type, payload] = finalEvent
    dispatchDepth = dispatchDepth + 1
    const reduced = reduceFxSupply(type, payload)
    dispatchDepth = dispatchDepth - 1

    /* reduce result with afterfx (for batch ops, etc.) */
    const finalResult = collapseToSideFx(reduced)

    // EXECUTE SIDE FX
    finalResult.sideFx.forEach(([type, payload]) => reg.sideFx[type](payload))
  }

  /** DEFAULT CORE REGISTRATIONS **/
  regReduceFx('db', (acc, newStateOrReducer) =>
    Object.assign({}, acc, { db: nextDb(acc.db, newStateOrReducer) })
  )
  // regReduceFx('dispatch', reduceDispatchStateless)
  // set global state and notify if dirty

  // add set state to end of side fx
  // fixme. should probably just do as needed
  regAfter('db', acc => Object.assign({}, acc, { sideFx: [...acc.sideFx, ['setState', acc.db]] }))
  regSideFx('setState', (db) => setState(db))

  return {
    reg,
    stateListeners,
    fx,
    getState,
    setState,
    notifyState,
    regReduceFx,
    regFx,
    regSideFx,
    subscribeToState,
    reduceFxToEnd,
    reduceFxSupply,
    getDispatchDepth,
    regSupplier,
    regBefore,
    regAfter,
    reduceFx
  }
}
