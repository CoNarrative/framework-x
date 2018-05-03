import { initStore, createRouter } from 'framework-x'
import devtools from 'react-waterfall-redux-devtools-middleware'

const store = {
  initialState: {},
}
const prod = process.env.NODE_ENV === 'production'
export const { Provider, connect, dispatch, Subscriber, regEventFx, regFx } =
  initStore(store, !prod && devtools())
