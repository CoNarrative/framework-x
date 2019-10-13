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
 * Calls Redux reducers with new state from framework-x
 * @param env - Framework-X env
 * @param store - Redux store
 * @param reducer - Your root Redux reducer
 * @returns {{ dispatch: Function }}
 */
export const frameworkXRedux = (env, store, reducer) => {
  const { replaceReducer } = store

  replaceReducer((state, action) => {
    if (env.state.pendingReduxState) {
      env.state.pendingReduxState = false
      return reducer(env.state.db, action)
    }
    return reducer(state, action)
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
    return env.fx.dispatch(env, event) // assumes this is an outbound Redux event
  }

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
 * Returns Redux middleware
 * @param env - Framework-X env
 * @returns function to be passed to Redux's applyMiddleware as the last argument to createStore
 */
export const makeFrameworkXMiddleware = env => store => next => action => {
  if (!env.eventFx.hasOwnProperty(action.type)) {
    return next(action)
  }

  if (!env.state.pendingReduxState) {
    env.state.pendingReduxState = true
    env.state.db = store.getState()
  }

  let acc = createAccum(env)

  reduceEventEffectsRedux(env, acc, [action.type, dissoc('type', action)])

  acc.queue.unshift(['setDb', acc.state.db], ['notifyStateListeners'])

  env.fx.applyImpure(env, env.fx.eval, acc)

  return next(action)
}
