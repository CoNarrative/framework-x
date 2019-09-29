import React from 'react'
import { regFx, createStore, createSub } from 'framework-x'
import { ErrorScreen } from './ErrorScreen'
import { evt } from './eventTypes'
import { Provider } from './Root'
import { component } from './component'
import * as R from 'ramda'

const env = R.path(['env'])
const acc = R.path(['acc'])
const error = R.path(['error'])

const Root = component('Root', createSub({
  env,
  acc,
  error
}), ({ env, acc, error, dispatch }) => {
  if (!error) return null
  return <ErrorScreen {...{ env, acc, error, dispatch }} />
})


const regErrorScreenFx = ({ regFx, regEventFx }) => {
  regFx('evalClosure', (env, f) => f())
  regEventFx(evt.RESET, () => [['db', R.omit(['env', 'acc', 'error'])]])
  regEventFx(evt.SKIP_EFFECT, ({ db }) => {
    const { env, acc } = db
    return [
      ['dispatch', [evt.RESET]],
      ['evalClosure', () => {
        acc.queue.unshift()
        env.fx.resume(env, acc, acc)
      }]]
  })

  regEventFx(evt.RETRY_EVENT, ({ db }, event) => {
    const { env } = db
    return [
      ['dispatch', [evt.RESET]],
      ['evalClosure', () => {
        env.fx.dispatch(env, event)
      }]]
  })
  regEventFx(evt.RETRY_EVENT_WITH_EDIT, ({ db }, event) => {
    const { env } = db
    let eventVector
    try {
      eventVector = JSON.parse(event)
    } catch (e) {
      return [
        ['db', R.assocPath(['editing', 'event', 'error'],
          { type: 'json/parse', message: e.message })]]
    }

    return [
      ['dispatch', [evt.CANCEL_EDIT, ['event']]],
      ['dispatch', [evt.RESET]],
      ['evalClosure', () => {
        env.fx.dispatch(env, eventVector)
      }]]
  })
  regEventFx(evt.START_EDIT, ({ db }, [key, value]) => {
    return [['db', R.assocPath(['editing', key], { initialValue: value, value })]]
  })
  regEventFx(evt.UPDATE_EDIT, ({ db }, [key, value]) => {
    return [['db', R.assocPath(['editing', key], { value })]]
  })
  regEventFx(evt.CANCEL_EDIT, ({ db }, [key]) => {
    return [['db', R.dissocPath(['editing', key])]]
  })
}

export const createDevtools = (env) => {
  const { dispatch, setState, getState, subscribeToState, regFx: regFxLocal, regEventFx } = createStore()
  regErrorScreenFx({ regEventFx, regFx: regFxLocal })
  regFx(env, 'handleError', (env, acc, e) => {
    if (e.isResumable && env.errorFx && env.errorFx[e.name]) {
      env.errorFx[e.name](env, acc, e)
      return
    }
    setState({ env, acc, error: e })
  })

  return {
    FrameworkXDevtools: () =>
      <Provider {...{ dispatch, getState, subscribeToState }}>
        <Root />
      </Provider>
  }
}



