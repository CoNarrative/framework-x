import { initStore, createRouter, devtools } from 'framework-x'

const prod = process.env.NODE_ENV === 'production'
export const { Provider, connect, dispatch, component, regEventFx, regFx } =
  initStore(!prod && devtools())
