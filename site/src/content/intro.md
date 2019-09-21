---
path: /intro
---

# Framework-X: Reasonable global state for React

Framework-X is a Javascript framework that processes events and descriptions of their effects, allowing immutable state
transformations and side effects to be written together as pure functions.

Framework-X and shares key features with Redux in its emphasis on global immutable state and event dispatch, but has the
most in common with `re-frame`, a Clojurescript framework upon which it was originally based.

Framework-X has been used in mid-size production applications for about 1.5 years and is being open sourced today under
the MIT license. 


# How it works
 
React components dispatch custom events with optional arguments. When an event is dispatched, the framework calls
registered handlers for the event with the event's arguments and the current global state.

Instead of invoking side effects or performing state updates directly, event handlers describe the effects an event
should have. Handlers may describe a state update or a side effect like an API call or a dispatch to another event as a
pure function.

Effects like `db` participate in the reduction and are registered with the framework as `reduceFx`. During the dispatch
evaluation phase, the framework applies them to a copy of the current global state. This accumulator is passed to all
event handlers invoked as a result of the initializing event, allowing event handlers to be composed into a single
reduce function without affecting the global state and produce a single state change per event dispatched from the view. 

In addition to the pending state value, the accumulator stores a list of reductions for each `reduceFx` invocation, a
stack of effects that have been evaluated, and a queue of side effects accumulated from event effects handlers in
evaluation order that will be applied the end of the dispatch reduction phase. 

Once the reduction is realized, dispatch adds two side effect descriptions to the front of the accumulator's effect
queue, one that sets the global state to the reduced state value and another to notify React of the state change.

At this point, the framework has executed no side effects. It only has a plan of what to do. Custom
implementations may choose operate over the set of effects before they are run and alter the execution plan, supporting
use cases like combining API effects to run in parallel.

Finally, the effects queue is evaluated in order with the current environment and the accumulator. Each effect is
presumed to have a side effect and may invoke other effect handlers directly. Asynchronous operations may invoke
dispatch to delegate to event handlers when their work is complete. 

In the event of an error, optional `errorFx` handlers are called with the accumulator containing the stack, queue and
accumulated state for the event that was originally dispatched.


# Code

## Events

Events are modeled as a tuple of an event name and optional payload argument:

```js
const evt = {
  INITIALIZE_DB: 'initialize-db',
}

const {
  dispatch,
  getState,
  setState,
  subscribeToState,
  regFx,
  regEventFx
} = createStore()

dispatch(evt.INITIALIZE_DB, {
  todos: [],
  visibilityFilter: visibilityFilter.ALL,
  newTodoText: '',
  notifications: []
})

```


## Event effect handlers

`regEventFx` describes the effects events should have. 

The `db` effect can be invoked with the next state value or a reducer function that returns the next state as a function
of the current one.

```js
regEventFx(evt.ADD_TODO, ({ db }, text) => {
  return [
    ['db', updateIn(['todos'], R.append({ text, done: false }))]
  ]
})
```

The `db` effect describes the transformation that should be applied to the `db` as the result of the "ADD_TODO" event.
This allows the handler to remain a pure function, producing the same result for the same arguments.

With this pattern, event effect handlers can describe arbitrary side effects that should result from an event and still
remain pure functions.


```js
regEventFx(evt.ADD_TODO, ({ db }, _, text) => [
    ['db', updateIn(['todos'], R.append({ text, done: false }))],
    ['dispatch', evt.SET_TODO_TEXT, '']
  ]
)

regEventFx(evt.SET_TODO_TEXT, (_,  text) => [
    ['db', R.assoc('newTodoText', text)]
  ]
)
```

Dispatching `SET_TODO_TEXT` from the `ADD_TODO` event effect handler achieves the same result as if we had combined both
state operations into one, without side effects. 


This pattern can be used with custom side effects:

```js
regFx('notification', ({ fx: { dispatch } }, { type, message, duration = 900 }) => {
  const id = type + '/' + Date.now().toString()

  const timeout = setTimeout(() => dispatch(evt.HIDE_NOTIFICATION, { id }), duration)
  
  dispatch(evt.SHOW_NOTIFICATION, { id, type, message, timeout })
})

regFx('clearTimeout', (_, n) => {
  clearTimeout(n)
})

regEventFx(evt.ADD_TODO, ({ db }, _, text) => [
    ['db', updateIn(['todos'], R.append({ text, done: false }))],
    ['dispatch', evt.SET_TODO_TEXT, ''],
    ['notification',  {
      type: 'success',
      message: 'Todo added.',
      duration: 5000
    }]
])

regEventFx(evt.SHOW_NOTIFICATION, ({ db }, _, { id, type, message, timeout }) => [
  ['db', updateIn(['notifications'], R.append({ id, type, message, timeout })) ]
])

regEventFx(evt.HIDE_NOTIFICATION, ({ db }, _, { id }) => {
  const notification = R.find(x => x.id === id, R.path(['notifications'], db))
  
  return [
    ['db', updateIn(['notifications'], R.reject(R.propEq('id', id)))],
    ['clearTimeout', notification.timeout]
  ]
})
```

# Derived values

Framework-X uses memoized functions called selectors to return derived values from the state.

The most basic selectors provide a raw value from the global state: 

```js
export const getAllTodos = R.path(['todos'])
```

Other selectors that depend on `getAllTodos` receive `db.todos` and avoid recomputing if it hasn't changed:

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
 
> Reducers specify how the application's state changes in response to
> actions sent to the store. ... 

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
> ***Note**: Emphasis is Redux's.*

Framework-X satisfies these requirements while stiWe agree reducing functions should be pure in this way. But we find
fewer reasons in theory and practice that an event's effects should be separated in this way.

The consequences of calling reducer code directly entail that events can't be handled in one place with a pure function.
This requires the existence of something like Redux's middleware, so that reducers can be pure functions and middleware
can execute side effects. This works, but comes with some cost:
- All events pass through middleware 
- Individual middleware may operate on some events but not others
- Some middleware look for a particular key on the event and do
  something if it's present based on arbitrary logic
- Events that are handled in middleware may also be handled in a reducer
- Middleware may mutate the event. Any changes are visible to subsequent
  middlewares and reducers. Middleware is executed in the order it was
  registered.
- Middleware is unable to specify a state update directly

- Middleware may be a third-party library with its own API


On the whole, the way reducers and middleware are separated make
understanding the effects of an event and the way an application works
contingent upon understanding what the reducer does and what the
middleware does. We've not yet seen a benefit from organizing things
this way, but we have seen tremendous benefits from specifying an
event's effects in one place. 

Further, we can still offer pure functions that update state in response
to an event. A `dispatch` returned from `regEventFx` doesn't actually
dispatch anything. It's only a description of what should happen. This
is the same for the `db` effect, which is a pure functional description
of the transformation that should be applied to the current state. Other
effects like `route` effects, API requests, and anything custom effects
you register are the same as well.


# Motivation


#### Less code.
 
The same app written using `re-frame` (968 loc) requires about 47% as
much code as Redux (2050 loc). The same app written in Framework-X is
about 59% (1213 loc).

For large, complex front-end applications, that adds up quickly, making it slower
to write the applications and harder to understand how they work.


#### Easier.

When a framework makes something difficult, it's natural to look for an
easier way to accomplish the same thing.

The harder a framework makes it to use global state, the more tempted we
are to use local state, even when that wasn't what we wanted at first.

The more code required to create subscriptions to the state, the easier
and more tempting it makes passing too many props through too many
components instead of each component only getting what concerns it.

The more opinionated a framework is about how state is organized -- and
the more work it requires from us to specify that structure -- the less
it tends to reflect the way we think it should be.

Achieving good application design is largely influenced by how difficult
it is for us to reach. Putting it more within reach seemed one good way
to end up with better applications.


#### Simpler.

We wanted a simpler framework that included no more and no less than
what we find essential:
- Global state
- Events
- Event effects
- Derived state
- Subscriptions

By not compromising on basic building blocks, Framework-X avoids
entailing future complexity. It's our experience that a minimal set of
building blocks can be combined to achieve complex things, all of which
are simple. Out of them, we can still construct complicated interactions
outnecessary for building complex



This lets us think about fewer things and think less about others,
leaving more mental bandwidth available for other tasks. As a result,
Framework-X has no concepts for:
- action creators 
- `mapDispatchToProps` 
- reducers 
- enhancers 
- middleware
- multiple stores 
- third-party libraries 
- middleware
- sagas
- special syntax
- classes
- decorators
- epics
- observables
- hooks


It can be hard The more pieces an application has, the harder it becomes
to follow it all the way through. Setting keys and values on a
Javascript object with messages



toward implementing
poor designs Easier ways were efficient in the moment, but costly long
term. "I'm not going to put this in global state -- nothing else needs
to know about it" was more often influenced by "I don't want to write
`mapDispatchToProps`, an action creator, handle the event in a reducer,
make this a connected component change the way we did things in order to
accommodate them at the expense of good design. If it's harder to get
props from the global state to a component, we're less likely to do that
as often as if it were more convenient.

Framework-X has a `dispatch` and `store` like Redux, but doesn't need
middleware, action creators, or `mapDispatchToProps`. Though some
differences between Framework-X and Redux might seem slight, they end up
removing the need for entire concepts.

Typically, Redux requires using `connect(mapStateToProps,
mapDispatchToProps)(MyComponent)` from `react-redux` to be able to
`dispatch` an event from a component. This injects `store.dispatch` into
the component where it can be accessed via `this.props.dispatch`, or --
if a `mapDispatchToProps` function was provided that takes `dispatch` as
an argument and returns an object of `{myAction: (args) => dispatch({
type:'eventName', payload: args })` -- a function that dispatches the
action can be accessed via `this.props.myAction`. This was too much
overhead for us, especially for something as common and essential as
dispatching events. So components just import dispatch from the created
store. If they 

This also led us to get rid of action creators as a reified concept. 

The overall result was a tremendous reduction in developer overhead. 



#### More intuitive, straightforward




