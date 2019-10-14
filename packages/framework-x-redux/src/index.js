import { regFx, createAccum } from 'framework-x'
import assoc from 'ramda/es/assoc'
import dissoc from 'ramda/es/dissoc'


// framework-x -> redux
export const dispatchSignatureAdaptor = (event) => {
  const args = event[1]
  return args ? assoc('type', event[0], args) : { type: event[0] }
}

// framework-x -> redux
export const makeInteropDispatch = store => (env, event) => {
  store.dispatch(dispatchSignatureAdaptor(event))
}

/**
 * Returns the state to Redux computed from the result calling the Redux reducer with
 * the state and action and calling Framework-X event handlers with the same
 * @param env
 * @param reducer
 * @returns {Function}
 */
const makeFrameworkXReducer = (env, reducer) =>
  (state, action) => {
    if (!state) { // @@INIT seems special
      const value = reducer(state, action)
      env.fx.eval(env, ['setDb', value])
      return value
    }

    env.fx.eval(env, ['notifyStateListeners'])
    return env.state.db
  }

/**
 * Wraps Redux's root reducer with one that adds updates from Framework-X event handlers
 *
 * Returns a dispatch function using Framework-X's event signature that may be used to
 * dispatch actions to Redux or Framework-X
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
    env.state.db = reducer(state, action)
  })

  const dispatch = makeInteropDispatch(store)

  regFx(env, 'dispatch', dispatch)

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
    console.log(`[reduce-event-fx] no handlers for ${type}, queuing dispatch to Redux`)
    // assume this is an outbound Redux event (it could be unhandled).
    // dispatch to obtain all consequent state updates before our execution continues
    // acc.queue.push(['next'])
    acc.queue.push(['dispatch', event])
    return //env.fx.dispatch(env, event)
  }

  console.log('[reduce-event-fx] found handler, loading results into accum', type)
  eventHandlers.forEach((handler) => {
    const effects = handler({ ...acc.state }, args)
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
    console.log('[middleware] no fwx handler for', action.type)
    env.fx.eval(env, ['setDbWithReduxReducer', [env.state.db, action]])
    next(action)
    console.log('still hanging around from ', action)
    // env.state.db = store.getState()
    return
  }
  regFx(env, 'next', (env) => {
    console.log('[middleware]  next', action)
    next(action)
  })

  let acc = createAccum(env)

  reduceEventEffectsRedux(env, acc, [action.type, dissoc('type', action)])

  acc.queue.unshift(
    ['setDbWithReduxReducer', [acc.state.db, action]],
    ['next']
  )

  console.log('[middleware] applying', acc)
  env.fx.applyImpure(env, env.fx.eval, acc)

}
