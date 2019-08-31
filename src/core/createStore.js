import { reduceDispatchReg, reduceFx } from './reduceDispatch'

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
 * @param baseDef
 * @returns {{notifyState: (function(*=): void), regFxReducer: regFxReducer, regEventFx: regEventFx, dispatch: dispatch, getState: (function(): *), regFx: regFx, def: {regFxReducer, regEventFx, regFx, def}, stateListeners: Array, setState: setState, subscribeToState: (function(*=): number)}}
 */
export const createStore = (baseReg, initialState = {}) => {
  /* registrations -- these can be passed to new stores */
  const reg = baseReg ? Object.assign({}, baseReg) : {
    fxReg: {},
    eventFxReg: {}
  }

  /**
   * Underlying reducer that participates in reduceDispatch
   * @param fxType
   * @param reduce (reg, acc, payload)
   */
  const regFxRaw = (fxType, reduce) => {
    reg.fxReg[fxType] = reduce
  }

  /**
   * Normal fx signature
   * can return more fx requests now
   * @param fxType
   * @param perform
   */
  const regFx = (fxType, standardFxr) => {
    checkType('regFx', fxType)
    regFxRaw(fxType, (reg, acc, fxPayload) => {
      let after = []
      const context = {
        db: acc.db,
        fxType,
        after: fn => {
          after = after.concat([fn])
        }
        // determine: Do I need these?
        // setState,
        // dispatch
      }
      const fxDef = standardFxr(context, fxPayload)
      /* incorporate any after requests */
      acc = Object.assign({}, acc, { after: acc.after.concat(after) })
      /* a normal fxr can return more fx */
      return reduceFx(reg, acc, fxDef)
    })
  }

  const regEventFx = (type, fn) => {
    // todo: add type as array or function signatures
    checkType('regEventFx', type)
    // we allow multiple event fx for one event name
    reg.eventFxReg[type] = [...reg.eventFxReg[type] || [], fn]
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
   * dispatch and receive new db and instructions
   * @param payload
   * @returns {(function(*=, *=): function(*=, *=): *)|*}
   */
  const reduceDispatch = payload => reduceDispatchReg(reg, { db, after: [] }, payload)

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
    const result = reduceDispatch([type, payload])
    dispatchDepth = dispatchDepth - 1
    // get the state change in quickly
    // fixme. in the future we should generalize this so other "aftereffectors"
    // can operate over the whole regFx state
    if (result.stateIsDirty) {
      setState(result.db)
    }
    result.after.forEach(after => after())
  }

  // These two are core so we always have these. They can be overridden as desired.
  regFxRaw('db', (_, acc, newStateOrReducer) =>
    Object.assign({}, acc, { db: nextDb(acc.db, newStateOrReducer), stateIsDirty: true })
  )
  regFxRaw('dispatch', reduceDispatchReg)

  return {
    reg,
    stateListeners,
    dispatch,
    getState,
    setState,
    notifyState,
    regEventFx,
    regFx,
    regFxRaw,
    subscribeToState,
    reduceDispatch,
    getDispatchDepth
  }
}
