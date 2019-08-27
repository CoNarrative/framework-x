> Note: These examples use Ramda (`R.`). We encourage trying it, but
> it's not required. 
> We use it because it provides immutability, we're used to it, and
> because 90% of functions Framework-X apps tend to be `db` effects and
> selectors, which require a global state argument. Currying lets us
> assume we're operating over the db and write in a way we feel is more
> natural. Everything can be written with vanilla Javascript and React.
> If in doubt, there's absolutely no magic or special syntax involved
> (we're generally not fans of either).


---






betwen reducers and middleware, reasons no other restrictions on what
Redux requires that reducers are "pure functions" that receive an event
and the global state. They use these arguments to return the next state.

This entails at least two things:

`re-frame` showed we didn't really need reducers in the way Redux
defines them. Once we got rid of them, we realized we didn't need
middleware.



1. They don't mutate the global state. 
2. You can't `dispatch` another action, because it will have side
   effects. return the next state as the function of an event and the
   previous state. This means things the state should not be mutated,
   there should be no reads from stateful things like local storage, and

Here, `re-frame` and Framework-X basically ask two questions: "Why not?"
and "What if you could?"


# "Why not?"

> We'll explore how to perform side effects in the advanced walkthrough.
> For now, just remember that the reducer must be pure. Given the same
> arguments, it should calculate the next state and return it. No
> surprises. No side effects. No API calls. No mutations. Just a
> calculation.
[From Redux's documentation](https://redux.js.org/basics/reducers#handling-actions)

Redux requires reducers, the functions that return the next state as the
function of an event and the previous state, to be pure functions. This
means things like the state object should not be mutated, there should
be no reads from stateful things like local storage, and there can be no
`dispatch`.

None of this is a bad idea, and it affords a lot of useful features
related to things like testability and time-travel debugging. 


# "What if you could?"

If you allow dispatch in reducers, you basically don't have reducers
anymore, and you don't need middleware.

there's
translate to making application code clear or easier to reason about.
Maybe there's something else that happens via middleware or a saga.




 
Then you wouldn't need middleware.





<!--After using it on a project and seeing how simple and expressive it was,-->
<!--and experiencing friction with the existing Javascript frameworks, we-->
<!--decided to bring what we liked about it to Javascript.-->

#### Less code.
 
The same app written with `re-frame` (968 loc) requires about 47% as
much code as Redux (2050 loc). Framework-X is about 59% (1213 loc).

For large, complex front-end applications, that adds up quickly, making it slower
to write the applications and harder to understand how they work.


#### Easier.

Typically, when a framework makes doing something verbose or difficult,
we look for easier ways of accomplishing the same thing. 

The harder a framework makes it to use global state, the more tempted we are to use
local state -- even when that wasn't what we wanted at first. 

The more verbose a framework makes it to subscribe to values from the
state, the easier and more tempting it makes passing too many props
through too many components, instead of each component only getting what
concerns it.

The more opinionated a framework is about how state is organized -- and
the more work it requires from us to modify that structure -- the less
our state is modeled how we think it should be.

The more places and methods a framework , the more 


#### Simpler.

We wanted a simpler framework that included only what we find essential:
- State
- Events
- Event effects
- Derived state
- Subscriptions



- No action creators 
- No `mapDispatchToProps` 
- No reducers 
- No enhancers 
- No multiple stores 
- No third-party libraries 
- No middleware
- No sagas
- No special syntax
- No classes
- No decorators
- No epics
- No observables
- No hooks

It has what we find essential:
- State
- Events
- Event effects
- Derived state
- Component subscriptions




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



---




---
. hid the name of the event
  being dispatched on the sending end, but not receiving end., but added
  a layer of indirection that obfuscated the name of the event being
  dispatched We had no authoritative place to specify event signatures.
  
  
Some of these things can be mitigated. Action creators are idiomatic but
optional. `mapDispatchToProps` is optional -- we can use
`this.props.dispatch({ type:'some-action' })`.

