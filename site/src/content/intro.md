---
path: /intro
---

# Framework-X: Reasonable global state management for React apps
> Side effects may include other effects.


Framework-X is a front-end Javascript framework that lets you define the
effects of an event as a state change, side effect, or another event. 

Framework-X is a front-end Javascript framework that lets you connect
application events to their effects. An effect can be a state change,
"side effect", and may delegate to the effects of other events by
dispatching them.

Framework-X is a front-end Javascript framework that connects events
with effects.


Event handlers can return more than one effect, and more than one kind
of effect, for the event they handle. This means you can write code that
performs a state update and initiates an API call in the same place. Any
series of effects represented by an array is executed in the order
provided.


We'll highlight its differences from Redux and other forms of state
management for React, discuss the motivations and philosophy behind it,

and attempt to show its design is reasonable. 

uses a straightforward pattern to define what happens as the result
   of an an event by
This
   straightforward pattern makes code simple to read and write, and to
   discover what the application does when see all effects of each
   cause, and see where in the application each event occurs.
   
By "reasonable", we generally mean Framework-X tends to be:
1. **Logical** Applications define causes and their effects. The
   framework lets developers associate an event name with a list of
   effects that are executed in order whenever the event occurs.
2. **Organized** There's clear separation between app logic and
   rendering, between state and computed values based on the state.
3. **Fair** It doesn't ask developers to do things we find unreasonable:
   write boilerplate for common operations, solve problems the framework
   creates for them, or fill in holes the framework doesn't.
4. **Approachable** The API is small and defined in terms of simple
   functions. There are few framework-specific concepts.
5. **Flexible** The framework's design permits global state access and
   event dispatch from all components and event handlers and avoids
   making developers feel unnecessarily restricted when writing code.
6. **Composable** Events and effects are expressed as data structures. 
   They can be manipulated with Javascript the same as any other data.
7. **Extensible** You can add your own effects and use them from event
   handlers. You can redefine built-in effects like `db` and `dispatch`
   if you choose. Because effects are data structures, it's easy to
   write functions that return them using types or whatever you want.
8. **Well-prioritized** One state is easier to reason about than many
   separate ones. Framework-X doesn't sacrifice this on the way to
   trying to achieve gains in other areas, like decreased verbosity.
   
   
Framework-X's design is based on `re-frame`, a state management
framework written in Clojurescript. 

The model is simple: 

1. There are events.
2. There are effects. 
3. Events have effects: a state change, the execution of a function, or
   other events.


# Code

> Note: These examples use [Ramda](https://ramdajs.com/) (`R.`). We
> enjoy using it but it's not required.

Events have names. We typically export objects for application events
modeled as constants that resolve to strings:

```js
export const evt = {
  INITIALIZE_DB: 'initialize-db',
  ROUTE_CHANGED: 'route/changed',
  NAV_TO: 'nav/to',
  SET_TODO_TEXT: 'todo/set-text',
  CHANGE_FILTER: 'filters/change',
  ADD_TODO: 'todo/add',
  TOGGLE_DONE: 'todo/toggle-status',
  BEGIN_REMOVE_TODOS: 'todo/begin-remove',
  TODOS_REMOVED: 'todo/removed',
  MARK_ALL_DONE: 'todo/mark-all-done',
  CLEAR_ALL: 'todo/clear-all',
  CLEAR_ALL_DONE: 'todo/clear-all-done',
  TODO_STATUS_CHANGED: 'todo/status-changed',
  SHOW_NOTIFICATION: 'notification/show',
  HIDE_NOTIFICATION: 'notification/hide',
}
```

Events are dispatched with an optional payload argument.

```js
dispatch(evt.ADD_TODO, 'Use framework-x')
```

`regEventFx` associates events with their effects. It has access to the
current global state (`{db}`). State is immutable, and the next state is
always a function of the current one. The `db` effect, when executed by
the framework, will set the next state to the value provided or if it
receives a function it will call the function with the current state and
set the next state to the value the function returns:

```js
regEventFx(evt.ADD_TODO, ({ db }, _, text) => {
  // Use the current state directly and define the next one
  // const nextDb = Object.assign({}, db,  {todos: db.todos.concat({text, done: false})})
  return [
    // Return the next state as a value
    // ['db', nextDb]
    
    // Alternatively, supply a function describing the transformation 
    // ("reducer"). `framework-x` will call this with the current state for you
    ['db', updateIn(['todos'], R.append({ text, done: false }))]
  ]
})
```

We can easily define additional effects for this event, like resetting
the todo input's text whenever a new todo is added:


```js
regEventFx(evt.ADD_TODO, ({ db }, _, text) => {
  return [
    // first add the todo
    // ['db', updateIn(['todos'], R.append({ text, done: false }))]
    // Then set 'newTodoText' to an empty string in the global state
    // ['db', R.assoc('newTodoText', '')]
    
    // perform both transformations as one operation (`R.pipe` combines the functions)
    ['db', R.pipe(
      updateIn(['todos'], R.append({ text, done: false })),
      R.assoc('newTodoText', '')
    )]
  ]
})
```

Often, you'll already have an event that sets the todo input text. The
todo input component dispatches this event whenever the input field
changes.


```js
regEventFx(evt.SET_TODO_TEXT, (_, __, text) => {
  // single effects can be safely represented by an object instead of an array
  return {
    db: R.assoc('newTodoText', text)
  }
})
```

We can make use of this by dispatching `SET_TODO_TEXT` from `ADD_TODO`
and achieve the same result:

```js
regEventFx(evt.ADD_TODO, ({ db }, _, text) => {
  return [
    // first add the todo
    ['db', updateIn(['todos'], R.append({ text, done: false }))]
    // then set the todo text to an empty string
    ['dispatch', evt.SET_TODO_TEXT, '']
  ]
})
```

What if we want `ADD_TODO` to have other effects? Say we wanted to show
a notification:


```js
regEventFx(evt.ADD_TODO, ({ db }, _, text) => {
  return [
    // first add the todo
    ['db', updateIn(['todos'], R.append({ text, done: false }))]
    // then set the todo text to an empty string
    ['dispatch', evt.SET_TODO_TEXT, '']
    // then show a success notification that says "Todo added." for 5 seconds
    ['dispatch', evt.SHOW_NOTIFICATION, {
      id: 'todo-added-' + Date.now().toString(),
      type: 'success',
      message: 'Todo added.',
      duration: 5000
    }]
  ]
})

regEventFx(evt.SHOW_NOTIFICATION, ({ db }, _, { id, type, message, duration = 900 }) => {
  // Queue a timeout that will dispatch the `HIDE_NOTIFICATION` event 
  // with the id of this notification 
  const timeout =  setTimeout(() => dispatch(evt.HIDE_NOTIFICATION, { id }), duration)
  // Update the current state with this notification, will be available to all component subscribers
  // namely those that subscribe to the list of notifications and render them
  return {
    db: updateIn(['notifications'], R.append({
      id,
      type,
      message,
      timeout
    }))
  }
})

regEventFx(evt.HIDE_NOTIFICATION, ({ db }, _, { id }) => {
  // Get the notification from the global state (`getNotificationMap` 
  // is a memoized selector function that 
  // indexes the list of notifications by `id`)
  const notification = R.prop(id, getNotificationsMap(db))
  
  // Clear the notification's timeout
  clearTimeout(notification.timeout)

  // Remove this notification from the list of notifications. Subscribers will be notified, 
  // components won't render it anymore
  return {
    db: updateIn(['notifications'], R.reject(R.propEq('id', id)))
  }
})
```

Selector functions in Framework-X are the same as using Redux with
`reselect`. They're memoized functions that return derived values from
the state. Some selectors may access a key of the global state and
return it unmodified:

```js
export const getNewTodoText = R.path(['newTodoText'])
// Without Ramda: (db) => db.newTodoText
```

Components use selector functions to subscribe to state changes and 
return markup:

```js
export const EnterTodo = component('EnterTodo',
  createSub({ getNewTodoText }),
  ({ newTodoText }) =>
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

 
# Motivations

We used Redux from the time it was released. We thought it was well
designed:

- Separate model and view
- Immutable state transformations on a single state value
- Clear place for business logic that can be expressed with ordinary
  functions with `react-redux` 
- Derived state calculated simply and efficiently with `reselect`
- Messaging pattern that decouples what happens in our application from
  the way its effects are represented in a Javascript object
- Message types/names that described the system we were building, what
  the app does


As we continued to use it, there were some things we thought could be
better:
- We were writing a fair amount of code
- It was difficult to follow the code for actions that were meant to
  trigger an API call
- We turned to third-party middleware libraries in hopes of making our
  code more capable of expressing additional consequences for some
  events, like a state change and an API call
- If we wanted to add a key to the state, we had to write a new reducer
  (using `combineReducers`)
- Action creators gave us a place to specify an action's arguments but
  hid the the event's name it dispatched throughout the codebase
- There was no clear way to access the global state inside a reducer function (using `combineReducers`)
- There were times when it seemed more natural to respond to an event
  when it was handled in the reducer by dispatching another event,
  instead of figuring out how to produce the same result with middleware


Some of these we were able to find adequate solutions for. For others,
it seemed the best we could do was move the problem around. Ultimately,
we found our core issues with Redux stemmed from the way it defines
reducers.


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

We agree reducing functions should be pure in the sense they shouldn't
mutate the global state. But we find fewer reasons in theory and
practice that an event's effects should be separated in this way.

The consequences of enforcing it have entailed that all effects apart
from a new state value are specified in Redux's middleware. This comes
with some complexity:

- Events that are handled in the reducer may be handled here also
- Middleware may mutate the event. Any changes are visible to subsequent
  middlewares and reducers. Middleware is executed in the order it was
  registered.
- All events pass through middleware 
- Individual middleware may operate on some events but not others
- Middleware is unable to specify a state update directly
- Some middleware look for a particular key on the event and do
  something if it's present based on arbitrary logic
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




