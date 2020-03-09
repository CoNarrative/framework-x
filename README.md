![image](https://user-images.githubusercontent.com/9045165/68983068-2be79780-07be-11ea-9a3b-fc677c567832.png)


[![NPM](https://img.shields.io/npm/v/framework-x.svg)](https://www.npmjs.com/package/framework-x)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Netlify Status](https://api.netlify.com/api/v1/badges/204808f0-9975-4e67-9b42-5b4b0907374f/deploy-status)](https://app.netlify.com/sites/vigorous-curie-c09c4e/deploys)
[![CircleCI](https://circleci.com/gh/CoNarrative/framework-x.svg?style=svg&circle-token=b3e15b621e83d2e9d6b2d0eca6aac342a09f766d)](https://circleci.com/gh/CoNarrative/framework-x)

Framework-X is a Javascript framework that separates code from its execution, allowing the representation of programmer intent to exist independently of when, where and how it's performed.

Developers don't need to write and maintain event handling code in two different places to have repeatable behavior and
functional purity. You can write everything that happens in the order you want it to as a pure function and Framework-X
will perform it on your behalf.

[Learn more](https://framework-x.io/intro).

## Installation

```bash
npm i framework-x
```



## Example: State changes + side effects

> View the complete code [here](https://github.com/CoNarrative/framework-x/tree/master/examples/todomvc).

```js
import * as R from 'ramda'
import { fx } from '../fx'
import { regEventFx, regFx } from '../store'
import { updateIn } from '../util'

const evt = {
  INITIALIZE_DB: 'initialize-db',

  ADD_TODO: 'todo/add',
  SET_TODO_TEXT: 'todo/set-text',

  SHOW_NOTIFICATION: 'notification/show',
  HIDE_NOTIFICATION: 'notification/hide',
}

// Initialize the global state atom 
regEventFx(evt.INITIALIZE_DB, (_, state = {}) => {
  return [
    fx.db(state)
  ]
})

// Adding a todo
// Three things:
// 1. Add it to the state
// 2. Clear the todo input text
// 3. Show a notification that says "Todo added" for two seconds
regEventFx(evt.ADD_TODO, ({ db }, { id, text, done = false }) => [
  fx.db(updateIn(['todos'], R.append({ id, text, done }))),
  fx.dispatch(evt.SET_TODO_TEXT, ''),
  fx.notification({
    type: 'success',
    message: 'Todo added.',
    duration: 2000
  })
])

// Setting the todo text. 
// Affects the `db`/global state
// Associates `db.newTodoText` with SET_TODO_TEXT event's value
regEventFx(evt.SET_TODO_TEXT, (_, value) => [
  fx.db( R.assoc('newTodoText', value))
])

// Notification side effect definition
// `ADD_TODO` only returns a description of this so it remains a pure function even though this isn't. 
regFx('notification', (env, { type, message, duration = 900 }) => {
  // Get the `dispatch` function from the Framework-X environment
  // All other registered `fx` effects are here too if you need them
  const { fx: { dispatch } } = env

  const id = type + '/' + performance.now()

  // Show the notification 
  dispatch(env, [evt.SHOW_NOTIFICATION, { id, type, message }])

  // Hide it after X ms
  setTimeout(() => dispatch(env, [evt.HIDE_NOTIFICATION, { id }]), duration)

})

// Showing a notification: add it to the state (views can subscribe, react to changes)
regEventFx(evt.SHOW_NOTIFICATION, ({ db },  { id, type, message, timeout }) => [
  fx.db(updateIn(['notifications'], R.append({ id, type, message, timeout })))
])

// Hiding a notification: Remove it from the state
regEventFx(evt.HIDE_NOTIFICATION, ({ db }, { id }) => [
  fx.db(updateIn(['notifications'], R.reject(R.propEq('id', id))))
])
```


## API
https://framework-x.io/api


## Packages

### [error-tools](https://github.com/CoNarrative/framework-x/tree/master/packages/error-tools)
### [fetch-fx](https://github.com/CoNarrative/framework-x/tree/master/packages/fetch-fx)
### [framework-x-redux](https://github.com/CoNarrative/framework-x/tree/master/packages/framework-x-redux)


## Examples


Examples are in the [`examples`](https://github.com/CoNarrative/framework-x/tree/master/examples) folder. To install and run an example (e.g. todomvc):

```bash
git clone https://github.com/CoNarrative/framework-x
cd framework-x/examples/todomvc
npm i
npm start
```

#### todomvc 

Source: https://github.com/CoNarrative/framework-x/tree/master/examples/todomvc

CodeSandbox: 


#### RealWorld

Source: https://github.com/CoNarrative/framework-x/tree/master/examples/realworld

CodeSandbox: 

 


## License

MIT © [CoNarrative](https://github.com/CoNarrative)
