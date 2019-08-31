import { reduceDispatchDef } from './reduceDispatch'

const noop = () => {}

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
    fxReducerReg: {},
    eventFxReg: {}
  }

  const regFx = (fxType, perform) => {
    checkType('regFx', fxType)
    reg.fxReg[fxType] = perform
  }
  /**
   * Fx reducers allow fx to reduce the accumulated flow of db and effects
   * durring a dispatch reduction.
   * The two main use cases are the db and dispatch fx
   * @param fxType
   * @param reduce
   */
  const regFxReducer = (fxType, reduce) => {
    checkType('regFxReducer', fxType)
    reg.fxReducerReg[fxType] = reduce
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
      console.warn('attempt to call setState while in the middle of things.')
      return
    }
    db = nextDb
    notifyState(db)
  }

  /**
   * dispatch and receive new db and instructions
   * @param payload
   * @returns {(function(*=, *=): function(*=, *=): *)|*}
   */
  const reduceDispatch = payload => {
    console.log('def!!!!', reg)
    return reduceDispatchDef(reg, { db, fx: {} }, payload)
  }

  /**
   * dispatch and execute side effects
   * @param event
   */
  const dispatch = (...event) => {
    if (dispatchDepth > 0) {
      console.warn('attempt to call dispatch while in the middle of things.')
      return
    }
    const finalEvent = (event[0] instanceof Array) ? event[0] : event
    if (!event[0]) throw new Error('Dispatch requires at least a valid event key')
    const [type, payload] = finalEvent
    dispatchDepth = dispatchDepth + 1
    const result = reduceDispatch([type, payload])
    dispatchDepth = dispatchDepth - 1
    console.log(result)
    // Object.entries(result.fx).forEach()
  }

  // These two are core so we always have these. They can be overridden as desired.
  regFxReducer('db', (_, acc, newStateOrReducer) =>
    Object.assign({}, acc, { db: nextDb(acc.db, newStateOrReducer) }))
  regFxReducer('dispatch', reduceDispatchDef)
  regFx('db', ({ db }) => setState(db))
  regFx('dispatch', noop)

  return {
    reg,
    stateListeners,
    dispatch,
    getState,
    setState,
    notifyState,
    regEventFx,
    regFx,
    regFxReducer,
    subscribeToState,
    reduceDispatch,
    getDispatchDepth
  }
}
