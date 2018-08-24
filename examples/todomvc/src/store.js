import { createStore } from 'framework-x'
import devtools from 'react-waterfall-redux-devtools-middleware'

const prod = process.env.NODE_ENV === 'production'

const store = {
  initialState: {
    count: 5,
  },
}

export const {
  Provider,
  connect,
  dispatch,
  getState,
  setState,
  subscribeToState,
  Subscriber,
  regEventFx
} = createStore(store, !prod && devtools())
