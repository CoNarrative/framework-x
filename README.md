# framework-x

> Reasonable global state.

[![NPM](https://img.shields.io/npm/v/framework-x.svg)](https://www.npmjs.com/package/framework-x)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Netlify Status](https://api.netlify.com/api/v1/badges/204808f0-9975-4e67-9b42-5b4b0907374f/deploy-status)](https://app.netlify.com/sites/vigorous-curie-c09c4e/deploys)
[![CircleCI](https://circleci.com/gh/CoNarrative/framework-x.svg?style=svg&circle-token=b3e15b621e83d2e9d6b2d0eca6aac342a09f766d)](https://circleci.com/gh/CoNarrative/framework-x)


## Install

```bash
npm i framework-x
```



## Basic example

```js
import { createStore } from 'framework-x'

const { dispatch, regEventFx, regFx, getState } = createStore()


regEventFx("initialize-db", (_, state) => ({ db: state }))

regFx('log', (env, args) => console.log("[log-effect]", args))

const toggle = ({ db }) =>  {
  const current = db.toggled
  const next = !db.toggled
  
  return [
    ['db',  { toggled: next }],
    ['log', { previous: current, current: next }]
  ]
}

regEventFx('toggle', toggle)

expect(toggle({ toggled: false }))
.toEqual([
  ['db', { toggled: true }], 
  ['log', { previous: false, current: true }]
])


dispatch('initialize-db', { toggled: false })
dispatch('toggle')

// [log-effect] { previous: false, current: true }

expect(getState()).toEqual({ toggled: true})
```

Framework-X allows side-effects to be expressed as pure functions.


## API
https://framework-x.io/api


## Packages

### [error-tools](https://github.com/CoNarrative/framework-x/tree/master/packages/error-tools)
### [fetch-fx](https://github.com/CoNarrative/framework-x/tree/master/packages/fetch-fx)
### [framework-x-redux](https://github.com/CoNarrative/framework-x/tree/master/packages/framework-x-redux)


## Examples


Examples are in the `examples` folder. To install and run an example (e.g. todomvc):

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
