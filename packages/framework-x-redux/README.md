# framework-x-redux
> Bridge from Redux to Framework-X

## Installation
```bash
npm i framework-x-redux
```

## Requirements
- `redux@4`
- `react-redux@7`
- `react@16`
- `framework-x@1`

## Usage
```js
import { frameworkXRedux, makeFrameworkXMiddleware } from 'framework-x-redux'
import { createStore as frameworkXCreateStore } from 'framework-x'
import { applyMiddleware, createStore } from 'redux'
import reducer from './reducers'


const { env, regEventFx, regFx } = frameworkXCreateStore()
const frameworkXMiddleware = makeFrameworkXMiddleware(env)

const store = createStore(
  reducer,
  applyMiddleware(
    // other middleware
    frameworkXMiddleware
  )
)

const { dispatch } = frameworkXRedux(env, store, reducer)
```

## API

### `frameworkXRedux`
arguments: 
- `env` - from Framework-X `createStore`
- `store` - from Redux `createStore`
- `reducer` - Root reducer

returns: 
- `dispatch` - Redux dispatch with Framework-X's dispatch signature

Computes the next state as the result of calling a Redux `reducer` with the current action and state from Framework-X.
Allows arbitrary keys on the state to be set by Framework-X without pre-initialization or a corresponding reducer.
Favors the values of keys returned by the reducer if there is a conflict. The resulting state is accessible from Redux
and Framework-X through their normal APIs.


### `makeFrameworkXMiddleware`
arguments: 
- `env` - from Framework-X `createStore`

returns:
- Redux middleware

Synchronizes Framework-X `db` with the state returned by the root reducer for the current action.

Processes event handlers registered for `action.type` and the effects they return per normal Framework-X semantics.

Allows events dispatched from the view or other middleware to be handled by Redux, Framework-X, or both.

`dispatch` from event handlers has the following `framework-x-redux`-specific behavior: 

If Framework-X has no registered handlers for the event:
- We assume you've dispatched an event Redux is capable of handling. The event will be dispatched as a Redux action once
  the state transition is complete.

If Framework-X is registered to handle it:
- The event will not be dispatched to Redux: We assume you're communicating with another framework-x event handler. The
  dispatch is handled within Framework-X and not re-dispatched to Redux.


### `component`
arguments: 
- `name` - Name of component to show in stacktrace, React Dev Tools
- `subscriptionFn` - Function that accepts the global state and returns props. If no third argument provided, this is
  assumed to be a `renderFn`
- `renderFn` - Function that receives props and returns JSX/React elements

returns:
- ConnectedComponent

Same API and behavior as `component` from Framework-X but integrates with `react-redux` `Provider`. Calls the
component with props obtained from selectors, props passed to the parent component, and Redux's `dispatch` function that
uses Framework-X's `(eventName, args?)` signature.

Example: 

```js
import { Provider } from 'react-redux'
import { createSub } from 'framework-x'
import { component } from 'framework-x-redux'

const MyComponent = component('MyComponent', createSub({
  mySelector1,
  mySelector2
}), ({ mySelector1, mySelector2, myParentProps })=>{
  return  (
    <div></div>
  )
})

const Example  = () => 
  <div>
    <MyComponent myParentProps={42}  />
  </div>
  
const App = () => 
 <Provider>
   <Example />
 </Provider>
```


## Use cases

### Adding new feature to an existing Redux application
You may want to add Framework-X to a Redux application without modifying the existing codebase. The API was designed
with this in mind. All that's required is creating a Framework-X store and using its `env` to register `frameworkXRedux`
at application start along with the provided middleware. From there you're free to write event handlers and effects that
pertain to the new feature and write components for them. If you need to read from other parts of your app to develop
the new feature, your Redux state is merged with your Framework-X state, so you can access it from event handlers,
effects, selectors, etc. as needed.

### Interoperating with Redux middleware
If you want to avoid rewriting core application functionality expressed via middleware, like REST API calls and
interactions with local storage, you can continue to use them from Framework-X. Exact usage typically depends on what
your middleware expects to receive for an action. In general, if your middleware requires an action to be dispatched as
a function, you can dispatch it to Redux from an event handler or a `component` using the `reduxDispatch` effect.


### Using event handlers instead of reducers
The example in `react-redux-realworld-example-app` replaces the `editor` reducer with event handlers. Supposing the
`editor` reducer not been written beforehand, this example also shows how to add event handlers for a view layer written
in Redux. Each editor-related event that the application normally handles with a reducer is delegated to an event
handler. Existing Redux middleware for async API requests and components that use `react-redux` are used alongside this.
The example uses `combineReducers` and that returns the state for the framework-x-managed key i.e. `editor: state =>
state`.

### Dispatching events to Redux reducers
If you want to trigger a state transition that is already specified in a reducer from Framework-X, you can do so from a
component or event handler. When dispatching in this case from an event handler, we don't support handling the same
event over again in Framework-X. Choosing one or the other in this case isn't necessary but suggested as a best practice
at this time. TODO use a symbol

