import * as R from 'ramda'
import { derive } from 'framework-x'
import { getArticleFilters } from '../articles/selectors'

export const getTags = R.path(['tags'])
export const getSelectedTag = derive([getArticleFilters], R.prop('tag'))
