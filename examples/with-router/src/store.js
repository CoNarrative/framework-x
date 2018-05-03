import { initStore, createRouter, devtools } from 'framework-x'

const store = {
  initialState: {},
}
const prod = process.env.NODE_ENV === 'production'
export const { Provider, connect, dispatch, component, regEventFx, regFx } =
  initStore(store, !prod && devtools())
