import React from 'react'
import { regFx } from 'framework-x'
import { Root } from './Root'


export const createDevtools = (env) => {
  let subs = []
  const subscribeToError = (f) => {subs.push(f)}
  regFx(env, 'handleError', (env, acc, e) => {
    // need to know if someone handled this error
    // may want "only errors an app originated" to be handled  in which case
    // reg an errorFx for the  error type
    // but, also want something like devtools to handle any error not handled by app errorFx
    if (e.isResumable && env.errorFx && env.errorFx[e.name]) {
      env.errorFx[e.name](env, acc, e)
      return
    }
    subs.forEach(f => f(env, acc, e))
  })
  // return { Devtools: FrameworkXDevtools({ subscribeToError }) }
  return { FrameworkXDevtools: () => <Root subscribeToError={subscribeToError} /> }
}



