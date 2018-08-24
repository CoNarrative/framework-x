import { createStore, devtools } from 'framework-x'

const prod = process.env.NODE_ENV === 'production'


export const {
  dispatch,
  getState,
  subscribeToState,
  regEventFx,
} = createStore(!prod && devtools())
