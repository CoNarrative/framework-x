import defineLogic from './defineLogic'
import reduceDispatch from './reduceDispatch'

const noop = () => {}
/**
 * Create a store (logic plus state)
 * @param baseDef
 * @returns {{notifyState: (function(*=): void), regFxReducer: regFxReducer, regEventFx: regEventFx, dispatch: dispatch, getState: (function(): *), regFx: regFx, def: {regFxReducer, regEventFx, regFx, def}, stateListeners: Array, setState: setState, subscribeToState: (function(*=): number)}}
 */
export const createStore = (baseDef) => {
  const def = defineLogic(baseDef)
  const stateListeners = []
  let db = null

  const subscribeToState = fn => stateListeners.push(fn)
  const notifyState = db => stateListeners.forEach(fn => fn(db))

  const getState = () => db
  const setState = nextDb => {
    db = nextDb
    notifyState(db)
  }

  /**
   * dispatch and execute side effects
   * @param event
   */
  const dispatch = (...event) => {
    const finalEvent = (event[0] instanceof Array) ? event[0] : event
    if (!event[0]) throw new Error('Dispatch requires at least a valid event key')
    const [type, payload] = finalEvent
    const result = reduceDispatch(def, { db, fx: {} }, [type, payload])
    Object.entries(result.fx)
  }

  const { regFx, regEventFx, regFxReducer } = def
  regFx('db', ({ db }) => setState(db))
  regFx('dispatch', noop)

  return {
    def,
    stateListeners,
    dispatch,
    getState,
    setState,
    notifyState,
    regEventFx,
    regFx,
    regFxReducer,
    subscribeToState,
  }
}
