---
path: /api
---

### `createStore`
> Creates an instance of a `framework-x` store


arguments: `(initialState?: {[k:any]: any}, middlewares?: Array<(type,
payload, effects, count)=>void>`

returns: `{ dispatch, regEventFx, regFx, getState, setState,
subscribeToState }`

Middleware receives every event that returns an effect after it's
applied.


### `dispatch`

> Sends a message with an optional payload

examples: 

```js
dispatch('todo/add')
dispatch('todo/add', payload)
```

### `regEventFx`

> Registers a function that is called when an event is `dispatch`ed. 

type: Function

arguments: `(eventName: string, (context: {db: Db} & {[k: any]: any},
eventName: string, eventArgs: any) => undefined | null | {[keyof
RegisteredFx]: any} | [keyof RegisteredFx, any][]`

returns: `undefined`

Receives the current global state.
 
May return a state update, dispatch other events, or both.

examples: 


> Simple `db` update
```js
regEventFx(evt.CLEAR_ALL, () => {
  return {
    // return a function that will be called with the current state and produce the next state
    db: R.assoc('todos', [])
  }
})
```


>  Update `db` then fire an event

```js
regEventFx(evt.CLEAR_ALL, () => { 
  // return a sequence of effects. Updates the state, then shows a notification. 
   return [
    [fx.db(R.assoc('todos', []))]
    [fx.dispatch(evt.SHOW_NOTIFICATION, 'all-clear')] 
  ]
})

```

You can register multiple handlers for the same event. They run in the
order they were registered.


### `createSub`

> Provides a component with a subscription to the `db`

type: Function

arguments: (subscriptionMap: {[k:any]: Subscription)
 
 
examples:

```js
createSub({
  todos: db => db.todos
})

const getAllTodos =  R.path(['todos'])
 createSub({ todos: getAllTodos })
```

- All key names prefixed with `get` also return a lowercase version of
  the key name in addition to the `get`-prefixed key. This is for
  convenience only.
  
example:

```js
const Todos = component("TodosList",  createSub({ getAllTodos }), 
({ allTodos, getAllTodos }) => 
   <div>{JSON.stringify(allTodos, null, 2) === JSON.stringify(getAllTodos, null, 2)}</div>
)
```

### `component`

>  Ties a subscription to a render function


arguments:

`(name: string, sub: Subscription, renderFn: React.Component), 

example:

```js
export const TodosList = component('TodosList',
  createSub({
    todos: getVisibleTodos
  }),
  ({ todos }) =>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {todos && todos.map(({ text, done }, i) =>
        <div
          key={i}
          style={{ display: 'flex' }}>
          {done
           ? <strike>{text}</strike>
           : <div>{text}</div>}
          <button onClick={() => dispatch(evt.TOGGLE_DONE, text)}>
            Toggle done
          </button>
        </div>
      )}
    </div>
)
```

### `getState`
> Returns the current state

type: Function 

arguments: `()`


### `setState`
> Sets the state to the value provided. If called with a function, sets
> the state to the result of calling the function the current state.


type: Function

arguments: `(newStateOrReducer: {[k:any]: any} | (db)=> {[k:any]: any})`


### `Provider`
> Enables `component` subscriptions

type: React.Component
 
arguments: {dispatch, getState, subscribeToState}

example:

```js
ReactDOM.render(
  <Provider
    getState={getState}
    subscribeToState={subscribeToState}
    dispatch={dispatch}
  >
    <App />
  </Provider>,
  document.getElementById('root'))
```
