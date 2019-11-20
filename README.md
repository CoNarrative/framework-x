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



## Example

```js
// Create a Framework-X store
import { createStore } from 'framework-x'

const { dispatch, regEventFx, regFx, getState } = createStore()

// Define our application's events 
const evt = {
  INITIALIZE_DB: 'initialize-db',
  TOGGLE: 'toggle'
}


// Define effect helpers
const fx = {
  db: (newStateOrReducer) => ['db', newStateOrReducer],
  log: (args) => ['log', args]
}


// Define a side effect handler
//
// Registers a side effect called `'log'`
regFx('log', (env, args) => console.log('[log-effect]', args))


// Define event handlers
//
// Registers an event handler / `eventFx` for the `'initialize-db'` event 
// Returns a `'db'` effect that will set the global `db` state to the event's payload
regEventFx(evt.INITIALIZE_DB, (_, state) => [fx.db(state)])


// Define an event handler function and register it to handle the `'toggle'` event.
// Reads the `toggled` value from the current global state (`db`)
const toggle = ({ db }) =>  {
  const current = db.toggled
  const next = !db.toggled
  
  return [
    fx.db({ toggled: next }),
    fx.log({ previous: current, current: next })
  ]
}

regEventFx(evt.TOGGLE, toggle)

// Define our initial state
const initialState = { toggled: false }

// `toggle` handler test
// 
// Calls the toggle handler with our initial state
// Returns the effects for when the global state value is `{toggled: false}`
expect(toggle(initialState)).toEqual([
  // By default, Framework-X interprets this as "set the global state to `{toggled: true}`"
  ['db', { toggled: true }], 
  // Framework-X will call the function we registered for 'log' with these arguments
  ['log', { previous: false, current: true }] 
])


// Dispatching events
//
// Send the `'initialize-db`' event to our Framework-X store with our initial state
dispatch(evt.INITIALIZE_DB, initialState)
// Send the `'toggle'` event to our Framework-X store
dispatch(evt.TOGGLE)

// Effects:
// 1. Console prints: 
// `[log-effect] { previous: false, current: true }`

// 2. Current global state is `{toggled: true}`
expect(getState()).toEqual({ toggled: true})
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
