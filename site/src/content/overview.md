---
path: /learn
---

# Overview

framework-x is a reactive, event-based front-end framework for
implementing deterministic state machines in Javascript. It shares much
of its API and design with Clojurescript's
[`re-frame`](https://github.com/Day8/re-frame), the
[most expressive front-end framework to date](https://www.freecodecamp.org/news/a-realworld-comparison-of-front-end-frameworks-with-benchmarks-2019-update-4be0d3c78075/)
. It has things in common with Redux, but differs in ways that have
far-reaching consequences for simplicity, mental overhead, and 
productivity.


Key features:
1. **State is a just another side effect.** You don't write
   different code for updating the state than you would an API call.
2. **Events are first-class.** You can respond to an event with another
   event, a state change, or both, all in the same place in code.
3. **All state is in one place**, the `db` state atom. You can put the
   application into any state it's capable of representing by setting
   this value. 
4. **Component subscriptions** let components specify what data they
   need and receive updates when it changes.
5. **Data flows from state to components through functions**. Any
   function that takes the `db` as an argument can be subscribed to by a
   component. Functions used as subscriptions are memoized, so the
   subscription only tells the component to rerender when there's a new
   value .
   
<!--3. **Top-level keys on the state atom are not special.** If you want to-->
<!--   read from three different top-level keys and dispatch a side effect-->
<!--   in the same place, you can. If you want add a key to the state that-->
<!--   doesn't exist yet you can, without having to write a reducer.-->
Key concepts: 

## Base selectors, `derive`d selectors

Base selectors are functions that receive a `db` as their argument and
return a value.

```js
const getAllTodos = R.path(['todos'])
```

Derived selectors selector functions as arguments and use the values
they return to produce a new value. 


```js
const getDoneTodos = derive([getAllTodos], R.filter(R.prop('done')))

const getNotDoneTodos = derive([getAllTodos], R.reject(R.prop('done')))

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

All functions passed to `derive` or `createSub` are memoized using
`reselect`. The selector pattern encourages a few valuable
things:

- Single source of truth

  Defining a function in one place to get commonly-accessed values from
  the global state.

  If the path location to the state is ever renamed or changed, only the
  selector's definition will need updated. All other selectors that
  depend on it will not break so long as the selector returns the same
  kind of value it has been.
  
- Explicit dataflow 

  An application that uses selectors, `createSub`
  and `derive` encodes a dependency graph necessary to carry out all
  necessary computations. By knowing which computations depend on the
  results of others and using memoization, framework-x apps are able to
  avoid recalculating `derive` inputs that have not changed from one
  state transition to the next.
  
- Understanding and readability
 
  The above example makes plain how "visible todos" is defined in the
  todo app. `derive`'s arguments tell us what it depends on: a value for
  all todos, done todos, not done todos, and a visibility filter.
  Nothing else provided as an input to this function, so we know exactly
  what we're working with.
  
  It's also plain to see that since `doneTodos` and `notDoneTodos` are
  derived from `allTodos` that we could write this selector with
  `visibilityFilter` and `allTodos` alone and filter them inside the
  body. There's not a great reason to do that. There's no getting around
  the necessary concepts of "done todos" and "not done todos". The most
  we'd be doing by making the dependencies less explicit is hiding them.
   
  This selector doesn't originate what "done todos" are. It needs a
  value for them to return which are visible given the current filter.
  
  Using `derive` in this way means you can change what "done" todos are,
  but you won't have to touch this function. 
  
  Defining "done todos" once     and referring to them by the selector name afterward is in line with
  how you might naturally reason about the problem: "if the visibility
  filter is "done", then only the `R.filter(R.prop("done"), allTodos)`
  todos should be visible" just isn't how we tend to think. "If the
  visibility filter is "done" then it's the done todos" is more like it.
  
  All that said, if "done todos" weren't an integral concept of the app,
  or code that would need to be written more than once, or we're not
  sure about either of those, writing everything inline and factoring
  out selectors later is a good approach.
  
  
- Separates required information from information that can be derived
  off of it, avoiding writing back to state when it's not necessary.

- Selectors can be used outside components.

- Runtime performance 

  Calling a selector twice in a row with an identical state object is
  virtually free. A cached value is returned if the equality check
  passes, which can reduce expensive, unnecessary recomputations to the
  equivalent of a hash map lookup.
  
  Returning the same object to React components means rendering is
  avoided unless the object has changed.

## Events and event handlers
Events are messages containing an identifying event name and an optional
data payload. They can be dispatched from anywhere in the application to
signal something has occurred.

Event handlers determine what happens in response to a given event,
effectively mapping the event to its effects (i.e. event -> "fx",
`regEventFx`). They receive the event payload, can read from global
state, update global state, and dispatch other events.

Example:

```js
// Whenever an "add todo" event, get the current new todo text from the global state, 
// make a new todo object out of it and add it to the list of todos,
// reset the new todo input text to '',
// then show a notification that a new todo was added 
regEventFx(evt.ADD_TODO, ({ db }) => {
  return [
    fx.db(updateIn(['todos'], R.append({ text: getNewTodoText(db), done: false }))),
    fx.dispatch(evt.SET_TODO_TEXT, ''),
    fx.dispatch(evt.SHOW_NOTIFICATION, {
      id: 'todo-added-' + Date.now().toString(),
      type: 'success',
      message: 'Todo added.',
      duration: 5000
    })
  ]
})
```

A powerful feature of framework-x is the ability to express state
transformations as events and refer refer to them as consequences of
other events. 

In this case, we need an event `SET_TODO_TEXT` for whenever someone
types into the new todo input field. We need a handler for it that
updates the state with the new input value. As we saw with selectors,
it's more natural when thinking about what needs to happen when a new
todo is added to think in terms closer to "set the todo text to an empty
string" than `R.assocPath(["nameOfKeyIMayChangeOrNotRememberRightNow",
"whereDoIStoreTheNewTodoTextAgain?"], '')`. We can climb the ladder of
abstraction by writing it once and giving ourselves a conversational
sort of interface to perform that operation. 

At the same time, you aren't forced to write your code this way. There
are many options and all are composable. The same result could be
expressed using a function instead, or by returning the next db value
that you want and conditionally dispatching a notification event:

```js
regEventFx(evt.ADD_TODO, ({ db }) => {
  const withNewTodo = updateIn(['todos'], R.append({ text: getNewTodoText(db), done: false }), db)
  const nextDb = R.assoc('newTodoText', '', withNewTodo)
  const nextDbFx = fx.db(nextDb)
  const maybeANotification = SHOWING_NOTIFICATIONS 
    ? fx.dispatch(evt.SHOW_NOTIFICATION, {
        id: 'todo-added-' + Date.now().toString(),
        type: 'success',
        message: 'Todo added.',
        duration: 5000
      })
    : []
    
  return [nextDbFx].concat(maybeANotification)
})
```






# `fx` and fx helpers

`fx` are composable and extensible instructions managed by
`framework-x` expressed as data by the return value of `regEventFx`.

`framework-x` includes two `fx` by default: `db` and `dispatch`.

They may be defined as an object when the order they happen doesn't
matter, or an array when it does.

Returning fx as an object:

```js
regEventFx('foo',()=>{
  return {
    db:  R.assoc('foo',true)
 }
})

regEventFx('bar',() => {
  return {
    dispatch: ['baz'] 
 }
})

// order is not guaranteed, doesn't allow multiple instances of the same 
// fx (`db` in this case) in the same handler
regEventFx('baz',()=>{
  return {
    db:  R.dissoc('foo'),
    dispatch: ['api-request', ["GET", "/foo"]]
    // ['db', R.assoc("loading", true)],
 }
})
```

Returning fx as an array:
```js
regEventFx('foo',()=>{
  return [
    ['db', R.assoc('foo',true)]
 ]
})

regEventFx('bar', () => {
  return [
    ['dispatch', 'baz'] 
 ]
})

regEventFx('baz', ()=>{
  return [
    ['db', R.dissoc('foo')],
    ['dispatch', 'api-request', ["GET", "/foo"]],
    ['db', R.assoc("loading", true)],
 ]
})
```

Using fx helpers:
```js
regEventFx('foo', ()=>{
  return [
    fx.db(R.assoc('foo',true))
 ]
})

regEventFx('bar',  () => {
  return [
    fx.dispatch('baz')
 ]
})

regEventFx('baz',() => {
  return [
    fx.db(R.dissoc('foo')),
    fx.dispatch('api-request', ['GET', '/foo']),
    fx.db(R.assoc('loading', true))
 ]
})
```

fx helpers are functions that return the array format.

## Writing your own `fx`

Users can define their own `fx` by mapping an fx name to a function with
`regFx`.

Example:

```js
const { pushNamedRoute, replaceNamedRoute, listen } = createRouter({
  history,
  routes,
})

regFx('route', args => pushNamedRoute.apply(null, args))

regEventFx('login-success', ()=> {
  return  {route: ['home']}
})
```

Users are free to override the default `db` and `dispatch` with their
own implementation with `regFx('dispatch', (whatever) =>
dispatch(whatever))`, `regFx('db', (whatever) => setState(whatever))`

