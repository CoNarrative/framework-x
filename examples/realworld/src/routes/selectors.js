import { derive } from 'framework-x'
import * as R from 'ramda'

export const getRoute = R.path(['router', 'match'])
export const getRouteId = derive([getRoute], R.path(['route', 'id']))
export const getRouteParams = derive([getRoute], R.path(['params']))
