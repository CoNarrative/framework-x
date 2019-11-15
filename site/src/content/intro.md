---
path: /intro
---

# Framework-X: Reasonable global state for React

Framework-X is a Javascript framework that separates code from its execution, allowing the representation of programmer intent to exist independently of when, where and how it's performed.

Using pure functions, Framework-X obtains algebraic effect descriptions of desired consequences before evaluating them in the context of the implementations you've defined. 


Its overall design borrows from [re-frame](https://github.com/day8/re-frame), a pioneering front-end framework written in Clojurescript. Like re-frame, Framework-X
applications are relatively terse. Apps can be written in Framework-X with about 40% fewer lines
of code than Redux.

We've used Framework-X in mid-size production applications at CoNarrative for the past 2 years and are releasing it today under
the MIT license.


# How it works

## Events and event handlers

Events in Framework-X are identified by their name. They may have data associated with them. Calling `dispatch` with an event name sends a message to the framework that can be interpreted to have effects.

```js
<button onClick={() => dispatch('add-todo', { text: 'Use Framework-X.' })}>
  Add todo
</button>
```


Event handlers specify the effects an event has. They can read from the current global state (`db`), the event's
data, and use them to determine what effects should result.

Framework-X ships with two built-in effects, `db` and `dispatch`.

The `db` effect describes a state change as a function of the current state.

```js
regEventFx('add-todo', ({ db }, { text }) => {
  return [
    ['db', updateIn(['todos'], R.append({ text, done: false }))]
  ]
})
```

`dispatch` lets us describe the effects of one event in terms of others. 

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

Event handlers may describe effects that are testable and
predictable, like immutable state transformations. But we can use them to state that unpredictable things like side effects
should happen, too, without losing any predictive capabilities.

Event handlers can depict inherently testable and predictable operations, like immutable state transformations. They can equally depict unpredictable operations (i.e. side effects), without engaging in unpredictable behavior themselves.

```js
const addTodoHandler = ({ db }, { text }) => {
  return [
    ['db', updateIn(['todos'], R.append({ text, done: false }))],
    ['dispatch', ['set-todo-text', '']],
    ['fetch', [
      { method: 'POST', url: '/api/new-todo', body: text },
      'new-todo/success', 
      'new-todo/fail'
    ]],
    ['db', R.assoc('loading', true)]
  ]
}

regEventFx('add-todo', addTodoHandler)

console.log(addTodoHandler({}, { text: 'Hi' }))
//  [['db', function],
//   ['dispatch', ['set-todo-text', '']],
//   ['fetch', [
//       { method: 'POST', url: '/api/new-todo', body: 'Hi' },
//       'new-todo/success', 
//       'new-todo/fail'
//     ]],
//   ['db', function]]


```

Invoking an event handler returns a plan of what to do. The framework iterates through the list, looking up the
definition for each effect (`db`, `dispatch`, `fetch`) and evaluating them against its implementation with whatever arguments the handler supplied.

`fx` handlers like `fetch` are functions that Framework-X assumes have side effects. They can be registered using `regFx`, where they are given access to the Framework-X environment and may define their signature.


```js
const createFetchFx = ({ fetch }) => 
  (env, [{ url, method = 'GET', body }, successEvent, failureEvent]) => {
    const { fx: { dispatch }} = env
    
    fetch(url, { method, body })
      .then(res => res.json())
      .then(json => dispatch(env, [successEvent, json]))
      .catch(e => dispatch(env, [failureEvent, e]))
})

const fakeFetchFx = ({ responses }) =>
  (env, [{ url, method = 'GET', body }, successEvent, failureEvent]) => {
    dispatch(env, [successEvent, R.path([method, url], responses)])
  }
  
regFx('fetch', 
  process.env.NODE_ENV === 'test'
    ? fakeFetchFx({ responses: {'GET': {'api/new-todo': { status: 201 }}} }) 
    : createFetchFx({ fetch: typeof window !== 'undefined' && window.fetch }))
```

Like all effects, Framework-X will interpret `fetch` however you tell it to, using whatever definition you've supplied
at runtime. You can define different implementations for different contexts, like one where `window.fetch` isn't
available (a test or server environment), when you don't want the normal behavior (a test mock), or to provide the same
behavior in a different way (using a library like `axios` instead of the Fetch API).


## Errors and continuations

When an error occurs while processing an event, Framework-X can pause its execution and delegate to error handlers to determine how to proceed. Error handlers can rewrite and reorder the current stack and resume execution with different instructions. 

Framework-X's error tools use this API (currently in alpha) to display the originally dispatched
event, the effect that caused the error, the effects have been performed so far, and the ones that are up next. Developers can see and edit this data in the
browser and resume program execution with their changes.


## Derived values

Framework-X removes local state and logic concerns from the component layer by making it convenient to subscribe to
functions that produce precomputed data from the global state.
 
Subscriptions are composed of named functions called selectors that take the global state and output something.

You can use the output of one selector as the input to another to progressively build up meaning from others.

```js
export const allTodos = R.path(['todos'])

export const doneTodos = derive([allTodos], R.filter(R.prop('done')))

export const notDoneTodos = derive([allTodos], R.reject(R.prop('done')))

export const visibilityFilter = derive([routeParams], R.propOr(VISIBILITY_FILTER.ALL, 'filter'))

export const visibleTodos = derive(
  [visibilityFilter, allTodos, doneTodos, notDoneTodos],
  (filter, all, done, notDone) => {
    switch (filter) {
      case VISIBILITY_FILTER.DONE:
        return done
      case VISIBILITY_FILTER.NOT_DONE:
        return notDone
      case VISIBILITY_FILTER.ALL:
        return all
      default:
        throw new Error(`Unknown visibility filter: ${filter}`)
    }
  }
)
```
 
Components can easily receive data derived from the global state by subscribing to selector functions.

```js
export const VisibleTodosList = component('VisibleTodosList',
  createSub({ todos: visibleTodos, editTodo }),
  ({ todos, editTodo }) =>
    <ul className="todo-list">
      {todos.map(({ id, text, done }, i) => {
          const isEditing = editTodo && id === editTodo.id
          return (
            <li key={i} className={isEditing ? 'editing' : undefined}>
              {isEditing
               ? <EditTodoTextInput />
               : <TodoItem {...{ id, text, done}} />}
            </li>
          )
        }
      )}
    </ul>
)
```


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

