import { regFx, createAccum } from 'framework-x'
import dissoc from 'ramda/es/dissoc'
import { makeInteropDispatch } from './dispatch'

export { component } from './component'


/**
 * Returns the state to Redux computed from the result calling the Redux reducer with
 * the state and action and calling Framework-X event handlers with the same
 * @param env
 * @param reducer
 * @returns {Function}
 */
const makeFrameworkXReducer = (env, reducer) =>
  (state, action) => {
    if (!state) { // assume '@@INIT'
      const value = reducer(state, action)
      env.fx.eval(env, ['setDb', value])
      return value
    }

    env.fx.eval(env, ['notifyStateListeners'])
    return env.state.db
  }

/**
 * Wraps Redux's root reducer with one that adds updates from Framework-X event handlers.
 *
 * Registers an effect `setDbWithReduxReducer` that calls the provided reducer with
 * a `state` and `action` and assigns the result to Framework-X's `db` state. It preserves
 * any keys added by Framework-X * code that don't have a corresponding reducer and favors
 * the next state value returned by the reducer otherwise.
 *
 * Returns a dispatch function with Framework-X's event signature that may be used to
 * dispatch actions to Redux and Framework-X
 * @param env - Framework-X env
 * @param store - Redux store
 * @param reducer - Your root Redux reducer
 * @returns {{ dispatch: Function }}
 */
export const frameworkXRedux = (env, store, reducer) => {
  const { replaceReducer } = store

  const frameworkXReducer = makeFrameworkXReducer(env, reducer)
  replaceReducer(frameworkXReducer)

  regFx(env, 'setDbWithReduxReducer', (_, [state, action]) => {
    env.state.db = Object.assign({}, state, reducer(state, action))
  })

  const dispatch = makeInteropDispatch(store)

  regFx(env, 'dispatch', dispatch)
  // regFx(env, 'reduxDispatch', (env, action) => store.dispatch(action))

  return {
    dispatch: (type, args) => args ? dispatch(env, [type, args]) : dispatch(env, [type]),
  }
}


export const reduceEventEffectsRedux = (env, acc, event) => {
  acc.events.push(event)
  acc.queue.push(['notifyEventListeners', event])
  const [type, args] = event

  const eventHandlers = env.eventFx[type]
  if (!eventHandlers) {
    // assume intended for Redux (may be unhandled)
    // dispatch to obtain all consequent state updates before our execution continues
    acc.queue.push(['dispatch', event])
    return
  }

  eventHandlers.forEach((handler) => {
    const effects = handler(Object.assign({}, acc.state), args)
    if (!effects) {
      return
    }
    const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)

    effectsList.forEach((effect) => {
      const [k, v] = effect
      const rfx = env.reduceFx[k]
      if (rfx) {
        const ret = rfx(env, acc, v)
        acc.stack.push(effect)
        acc.reductions.push(ret)
      } else if (k !== 'dispatch') {
        acc.queue.push(effect)
      } else {
        return reduceEventEffectsRedux(env, acc, v)
      }
    })
  })
}

/**
 * Redux middleware.
 *
 * When there are no Framework-X event handlers for an action:
 * - Updates Framework-X's `db` by calling the Redux reducer supplied to `frameworkXRedux`.
 * This is returned as the new state directly when Redux calls its reducer.
 * Framework-X's state will be ahead of `store.getState` until all middlewares have called `next`.
 *
 * Events dispatched from the view or other middleware:
 * - may be handled by Redux, Framework-X, or both
 *
 * Events dispatched from a Framework-X event handler:
 *
 * If Framework-X has no registered handlers for it:
 * - We assume you're communicating with your Redux app. The event will be dispatched as a Redux action once the state transition is complete.
 *
 * If Framework-X is registered to handle it:
 * - We assume you're communicating with other event handlers. The dispatch is handled within Framework-X and not re-dispatched to Redux.
 *
 *
 * `fx` see the result of Redux's reducer and `db` effects from event handlers for a given action.
 *
 * @param env - Framework-X env
 * @returns function to be passed to Redux's applyMiddleware as the last argument to createStore
 */
export const makeFrameworkXMiddleware = env => store => next => action => {
  if (!env.eventFx.hasOwnProperty(action.type)) {
    env.fx.eval(env, ['setDbWithReduxReducer', [env.state.db, action]])
    next(action)
    return
  }
  regFx(env, 'next', (_env) => {
    next(action)
  })

  let acc = createAccum(env)

  reduceEventEffectsRedux(env, acc, [action.type, dissoc('type', action)])

  acc.queue.unshift(
    ['setDbWithReduxReducer', [acc.state.db, action]],
    ['next']
  )

  env.fx.applyImpure(env, env.fx.eval, acc)
}
