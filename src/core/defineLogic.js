import { reduceDispatch } from './reduceDispatch'

function checkType(op, type) {
  if (typeof (type) !== 'string') throw new Error(`${op} requires a string as the fx key`)
  if (type.length === 0) throw new Error(`${op} fx key cannot be a zero-length string`)
}

const nextDb = (def, { db }, newStateOrReducer) => {
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

/**
 * Defines stateless store logic. Creates the definition for (and actual) reduceDispatch function.
 * In effect, defines a reducer that outputs state and fx
 * @param baseDef
 * @returns {{regFxReducer: regFxReducer, regEventFx: regEventFx, regFx: regFx, def: {helpers: {}, eventFxReg: {}, fxReg: {}, fxReducerReg: {}}}}
 */
export function defineLogic(baseDef) {
  const def = baseDef ? Object.assign({}, baseDef) : {
    fxReg: {},
    fxReducerReg: {},
    eventFxReg: {},
    helpers: {}
  }
  const regFx = (fxType, perform) => {
    checkType('regFx', fxType)
    def.fxReg[fxType] = perform
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
    def.fxReducerReg[fxType] = reduce
  }
  const regEventFx = (type, fn) => {
    // todo: add type as array or function signatures
    checkType('regEventFx', type)
    // we allow multiple event fx for one event name
    def.eventFxReg[type] = [...def.eventFxReg[type] || [], fn]
  }

  // These two are core so we always have these. They can be overridden as desired.
  regFxReducer('db', nextDb)
  regFxReducer('dispatch', reduceDispatch)
  // todo. Register dispatch async? Or just stick with the very core?
  return {
    def,
    regFx,
    regFxReducer,
    regEventFx
  }
}
