import { createStore, devtools } from 'framework-x'


export const store = createStore(process.env.NODE_ENV !== 'production' && devtools())

export const {
  dispatch,
  getState,
  setState,
  subscribeToState,
  regFx,
  regEventFx,
} = store
