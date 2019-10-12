---
path: /intro
---

# Framework-X: Reasonable global state for React

Framework-X is a Javascript framework that uses algebraic effects to express state transformations and side effects as
pure functions.

It's similar to
[Redux](https://redux.js.org/), though it requires about 40% less code to accomplish the same tasks. It was originally
based on
[`re-frame`](https://github.com/Day8/re-frame), a React framework for Clojurescript.

Framework-X has been used in mid-size production applications for nearly 2 years and is being open sourced today under
the MIT license.


# How it works

## Events
 
Events are typically dispatched from components. 

```js
<button onClick={() => dispatch('add-todo', { text: 'Use Framework-X.' })}>
  Add todo
</button>
```

## Event handlers

Event handlers (`eventFx`) are registered with the name of the event they handle using `regEventFx`. They receive the
current global state (`db`) and the event's arguments and return a list of effect descriptions or `undefined` for no
effects.
```js
regEventFx('add-todo', ({ db }, { text }) => {

})
```

## Effect descriptions

Effect descriptions are arrays that match the name and signature of registered effect handlers. Framework-X provides a
state update effect (`db`) and an effect that dispatches events (`dispatch`) by default.

`db` expects a function that describes a state transformation. It belongs to a specific category of effects that
participate in a reduction (`reduceFx`).

```js
regEventFx('add-todo', ({ db }, { text }) => {
  return [
    ['db', updateIn(['todos'], R.append({ text, done: false }))]
  ]
})
```

Event handlers may use the `dispatch` effect to incorporate the effects of other events. This allows event
handlers to be composed into a single reduce function. Framework-X produces one React `setState` operation per event
dispatched from the view layer, even when events are dispatched from event handlers.


```js
regEventFx('add-todo', ({ db }, { text }) => {
  return [
    ['db', updateIn(['todos'], R.append({ text, done: false }))],
    ['dispatch', ['set-todo-text', '']]
  ]
})

regEventFx('set-todo-text', (_, str) => {
  return [
    ['db', R.assoc('newTodoText', str)]
  ]
})

```

## Side effects

Side effect handlers (`fx`) are functions that perform side effects. They can be registered with `regFx` and used the
same as `db` and `dispatch`.

```js
const createFetchFx = ({ fetch }) =>
(env, [{ method = 'GET', body, url }, successEvent, failureEvent]) => {
  const { fx: { dispatch }} = env
  fetch(url, { method, body })
  .then(res => res.json())
  .then(json => dispatch(env, [successEvent, json]))
  .catch(e => dispatch(env, [failureEvent, e]))
})

regFx('fetch', createFetchFx({ fetch: window.fetch }))

regEventFx('get-user', ({ db }, { id }) => {
  return [
    ['db', R.assoc('loading', true)],
    ['fetch', [{ url:`/user/${id}` }, 'get-user/success', 'get-user/fail']]
  ]
})
regEventFx('get-user/success', ({ db }, user) => { ... })
regEventFx('get-user/fail', ({db }, e) => { ... })
```


Framework-X evaluates all side effects lazily. Each one is put in a queue until the end of the dispatch cycle. Event
handlers do nothing to affect the outside world. Instead, they produce a description of what should happen. Later, the
description can be evaluated.

Optionally, we could print the effects list to see if it's what we expect. Tests assertions can be written against it
without invoking any side effectful code, or with custom behavior for each effect. Code can analyze the effects
queue, allowing runtime optimizations like combining a series of API calls into a Promise.all, or arbitrary custom
behavior -- skipping certain effects, adding others, changing arguments.

By default, Framework-X evaluates the side effects queue in order against all registered side effect (`fx`) handlers 
with the current environment and whatever arguments they were provided from the event handler that returned them. Each
is presumed to have some side effect, and may invoke other effect handlers directly.


## Errors

Framework-X catches all errors thrown by event handlers or effect handlers resulting from an event dispatch. The default
root error handler invokes any error effect handlers (`errorFx`) registered to handle the error with the current
environment, the accumulator, and the error. 

Error effects may optionally specify how the framework should continue execution. The resume side effect (`fx.resumeFx`)
takes the existing execution plan, cancels it, and applies the new one. In the event of an error, the process repeats.

Framework-X's error tools use this API to render information about the error, including the originally dispatched
event, the effect that caused the error, and the effects that are still in the queue. Users may edit these in the
browser and resume program execution with their changes.

Nearly all Framework-X's core functionality is implemented in terms of its own API, allowing users to override the
default implementations down to the function that effects are evaluated with.


## Derived values

Like Redux, Framework-X uses memoized functions called selectors to return derived values from the state.

Basic selectors are plain functions that provide access to an untransformed value from the global state and are later
memoized by components or other selectors:

```js
export const getAllTodos = R.path(['todos'])
```

Selectors that depend on others use `derive`:

```js
export const getAllTodos = R.path(['todos'])

export const getDoneTodos = derive([getAllTodos], R.filter(R.prop('done')))

export const getNotDoneTodos = derive([getAllTodos], R.reject(R.prop('done')))

export const getVisibilityFilter = derive([getRouteParams], R.propOr(visibilityFilter.ALL, 'filter'))

export const getVisibleTodos = derive(
  [getVisibilityFilter, getAllTodos, getDoneTodos, getNotDoneTodos],
  (filter, all, done, notDone) => {
    switch (filter) {
      case visibilityFilter.DONE:
        return done
      case visibilityFilter.NOT_DONE:
        return notDone
      case visibilityFilter.ALL:
        return all
      default:
        console.error('unhandled visibility filter', filter)
        return all
    }
  }
)
```

## Components
 
Components use selector functions to subscribe to state changes:

```js
export const EnterTodo = component('EnterTodo',
  createSub({ getNewTodoText }),
  ({ newTodoText, dispatch }) =>
    <div>
      <input
        value={newTodoText}
        onChange={e => dispatch(evt.SET_TODO_TEXT, e.target.value)}
        onKeyDown={e => e.which === 13 && dispatch(evt.ADD_TODO)}
      />
      <button onClick={() => dispatch(evt.ADD_TODO)}>
        Add todo
      </button>
    </div>
)
```

 
# Comparison to Redux

[From Redux's documentation](https://redux.js.org/basics/reducers#handling-actions)
 
> Reducers specify how the application's state changes in response to actions sent to the store. [...]

> It's very important that the reducer stays pure. Things you should
> **never** do inside a reducer:
> - Mutate its arguments;
> - Perform side effects like API calls and routing transitions;
> - Call non-pure functions, e.g. Date.now() or Math.random().

> **Given the same arguments, it should calculate the next state and
> return it. No surprises. No side effects. No API calls. No mutations.
> Just a calculation.** ... We'll explore how to perform side effects in
> the advanced walkthrough. 
>
> *emphasis Redux's*

A Framework-X event handler is similar to a Redux reducer. Both are pure functions: They return the same thing for the
same arguments, and don't interact with the outside world at all.

Event handlers with a `db` effect produce a description of the operation a Redux reducer performs. 

```js
const todosReducer = (state, action)  => {
  switch (action.type) {
    case 'add-todo':
      const { text } = action.payload
      return R.append({ text, done: false}, state)
    default:
      return state
  }
}

const todoInputReducer = (state, action)  => {
  switch (action.type) {
    case 'add-todo':
      return action.payload
    default:
      return state
  }
}

regEventFx('add-todo', (_, { text }) => {
  return [
    ['db', R.pipe(
      updateIn(['todos'], R.append({ text, done: false })),
      R.assoc('newTodoText', ''))
    ]
  ]
})
```

Both versions accomplish the same thing. Using the `combineReducers` convention, a Redux application specifies the state
effect on each top-level key of the app's state. The Framework-X version specifies its transformation is specified
against the entire application state, and all event handlers can read from the whole application state by default
instead of being limited to the value of a single key.

Event handlers strictly "specify how the application's state changes." Their return value is a specification that can be
applied to the application state later. Reducers specify a state transition in their function body, but they must invoke
it to produce the next state value.

By itself this may not seem useful. However, Framework-X leverages the difference between "description" and "the thing
itself" to allow functions specify side effects without performing them. 


<!--How an effect is performed is-->
<!--defined elsewhere, and its execution occurs when it needs to.-->

In order for reducers to remain pure functions, side effects must be specified and invoked outside them. Redux uses
middleware for this purpose. The example below uses `redux-thunk` in an effort to show the basic differences in
approach.

```js
const getUser = ({ id }) => dispatch => {
  dispatch({ type: 'api/loading', payload: true })
  return fetch(`/user/${id}`)
    .then(res => res.json())
    .then(res => {
      dispatch({ type: 'api/loading', payload: false })
      dispatch({ type: 'get-user/success', payload: res })
    })
    .catch(e => {
      dispatch({ type: 'api/loading', payload: false })
      dispatch({ type: 'get-user/fail', payload: e })
    })
}

const userReducer = (state, action) => {
  switch(action.type) {
    case 'get-user/success':
      return action.payload
    case 'get-user/fail':
      console.error(action.payload)
      return state
    default:
      return state
  }
}

const loadingReducer = (state, action) => {
  switch(action.type) {
    case 'api/loading':
      return action.payload
    default:  
      return state
  }
}

regEventFx('get-user', (_, { id }) => [
  ['db', R.assoc('loading', true)],
  ['fetch', [{ url:`/user/${id}`, parseBody: ['json'] }, ['get-user/success'], ['get-user/fail']]]
])

regEventFx('get-user/success', (_, user) => ({ db: R.mergeRight({ loading: false, user }) }))

regEventFx('get-user/fail', (_, e) => { 
  console.error(e)
  return { db: R.assoc('loading', false) }
})
``` 

`redux-thunk` middleware allows users to `dispatch` a function as an action that receives `dispatch` and `getState`
arguments via a callback. From there, the callback can return a Promise for the thunk middleware to execute. 

In Framework-X, `get-user` is an event dispatched from the view like any other. Its event handler returns effects to set
the `loading` flag and fetch the user. We can provide configuration for the request, response parsing, and what events
should handle success and failure cases. 

The Redux example uses `combineReducers` so we handle each update to the global state individually. We've chosen to
dispatch an `api/loading` event in order to affect two different keys in the state, `user` and `loading`. We could have
written reducer code to look for events like 'get-user/request' and update the state in response, though this would
require we add cases to the switch statement for the `apiReducer` for each API call action our app makes.

Framework-X doesn't require middleware for side effects. Instead, the `get-user` handler returns a `fetch` effect
description that corresponds to a function by that name. By default, a `dispatch` from the view layer entails the
invocation of all effects its handlers define. Tests, tooling, and custom implementations may choose to return a list of
effects before they're executed. Further, the implementation of any effect may be defined or redefined easily, so we can
define `fetch` with a mock implementation. Were the `fetch` effect executed with the sample fetch effect we showed
earlier, we'd expect the API call's result to communicated with other events just like in the `getUser` code. We can
limit our success or failure since event handlers can update more than one key of the state at a time.

# Next steps

The source code for the project is available at
[https://github.com/CoNarrative/framework-x](https://github.com/CoNarrative/framework-x).

For the quickest way to dive in, check out the
[RealWorld example]() or the
[todomvc example]() on codesandbox.io.

If you're interested in how to use Framework-X with an existing Redux application, check out
[`framework-x-redux`](https://github.com/CoNarrative/framework-x/tree/master/packages/frameework-x-redux) on Github.

API documentation is available at
[framework-x.io](https://framework-x.io/).

You can follow us on Twitter
[@framework-x](https://twitter.com/framework_x). 

