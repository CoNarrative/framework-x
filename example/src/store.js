import { initStore } from './framework'
import devtools from 'react-waterfall-redux-devtools-middleware'

const prod = process.env.NODE_ENV === 'production'

const store = {
  initialState: {
    count: 5,
  },
}

export const { Provider, connect, dispatch, Subscriber, regEventFx } = initStore(store, !prod && devtools())