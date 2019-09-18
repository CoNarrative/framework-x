import { createContext } from 'react'

if (typeof window!=='undefined'&&window._frameworkXContext) {
  throw new Error('You have multiple Framework-X contexts in this app, which will cause nothing but trouble.')
}

export const Context = createContext()
if (typeof window!=='undefined') {
  window._frameworkXContext = Context
}

export const subs = {}
