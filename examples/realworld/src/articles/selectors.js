import * as R from 'ramda'
import { derive } from 'framework-x'
import { getRouteQuery } from '../routes/selectors'

const ARTICLES_PER_PAGE = 10
export const getArticles = R.path(['articles'])
export const getArticlesCount = R.path(['articlesCount'])
// shouldn't this be in the route?
export const getArticleFilters = R.pathOr({}, ['articleFilters'])
export const getPageNumbers = derive([getArticlesCount],
  articlesCount => R.range(0, Math.ceil(articlesCount / ARTICLES_PER_PAGE)))


export const getCurrentPageIndex = derive([getRouteQuery], query =>
  Math.ceil(R.propOr(0, 'offset', query) / ARTICLES_PER_PAGE))
