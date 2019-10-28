import { createStore as frameworkXCreateStore } from 'framework-x'
import { makeFrameworkXMiddleware } from 'framework-x-redux'


export const { env, regEventFx, regFx } = frameworkXCreateStore()
export const frameworkXMiddleware = makeFrameworkXMiddleware(env)
