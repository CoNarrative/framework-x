import * as R from 'ramda'
import { derive } from 'framework-x'
import { prettyStr } from './util'

export const getEnv = R.path(['env'])
export const getAcc = R.path(['acc'])
export const getError = R.path(['error'])
export const getCaughtEffect = derive([getAcc], R.pathOr([null], ['queue']), R.head)
const getEvents = derive([getAcc], R.pathOr([], ['events']))
export const getCaughtEvent = derive([getEvents], R.last)
export const getCaughtEventStr = derive([getCaughtEvent], prettyStr)
