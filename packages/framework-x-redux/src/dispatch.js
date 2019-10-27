import assoc from 'ramda/es/assoc'

// framework-x -> redux
export const dispatchSignatureAdaptor = (event) => {
  const args = event[1]
  return args ? assoc('type', event[0], args) : { type: event[0] }
}

// framework-x -> redux
export const makeInteropDispatch = store => (env, event) => {
  store.dispatch(dispatchSignatureAdaptor(event))
}
