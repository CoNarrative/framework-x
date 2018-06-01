import { createStore, devtools } from 'framework-x'

const prod = process.env.NODE_ENV === 'production'
export const { dispatch, regEventFx, regFx, getState, subscribeToState } =
  createStore(!prod && devtools())
