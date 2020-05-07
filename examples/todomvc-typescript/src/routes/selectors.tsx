import { derive } from 'framework-x'
import * as R from 'ramda'
import { Selector } from "../types"
import { VisibilityFilter } from "../constants"

export const getRoute:Selector<{params:VisibilityFilter}> = R.path(['router','match'])

export const getRouteParams:Selector<{filter:VisibilityFilter}> = derive([getRoute],R.path(['params']))
