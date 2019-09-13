---
path: /differences-from-redux
---

###### Table of Contents

# Differences from redux

In aggregate, no reducers, no middleware.

Redux:
Does not allow
- updating two top-level keys on the global state at the same spot in code

example:

```js
const fooReducer = (state, action) =>  {
  switch (action.type) {
    case 'my-event':
      return true
    default:
    return state
  }
}
const barReducer = (state, action) =>  {
  switch (action.type) {
    case 'my-event':
      return true
     default:
       return state
  }
}
// combine reducers etc.

regEventFx('my-event', () => ({ db: R.merge({ foo: true,  bar: true })))
```

- setting a top-level key on the global state that doesn't have a registered reducer

- updating the value of a top-level key on the global state without a reducer

- accessing a value from the state outside a reducer's context 

- dispatching an event/action from within a reducer

Example: 

```js
regEventFx('my-event', () => ({ dispatch: ['my-other-event']}))
```

- dispatching an event/action in response to an event/action without
  middleware
  
- importing dispatch




Redux encourages:
- middleware (thunk, saga), store enhancers, to perform side effects outside of a reducer
