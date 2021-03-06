import { createStore, devtools } from 'framework-x'


export const store = createStore(process.env.NODE_ENV !== 'production'
                                 && { eventListeners: [devtools()] })

export const {
  env,
  dispatch,
  getState,
  setState,
  subscribeToState,
  regFx,
  regEventFx,
} = store
