import { createContext } from 'react'

if (window._frameworkXContext) {
  throw new Error('You have multiple Framework-X contexts in this app, which will cause nothing but trouble.')
}

export const Context = createContext()

window._frameworkXContext = Context

export const subs = {}
