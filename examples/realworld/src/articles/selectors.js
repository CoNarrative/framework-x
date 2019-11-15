import { derive } from 'framework-x'
import * as R from 'ramda'
import { ARTICLES_PER_PAGE, tabNames } from '../constants'
import { getRouteParams } from '../routes/selectors'
import { getUser } from '../user/selectors'


export const getArticles = R.path(['articles'])
export const getArticle = R.pathOr({}, ['article'])
export const canModifyArticle = derive([getArticle, getUser], (article, user) =>
  R.path(['author', 'username'], article) === R.path(['username'], user))

export const getArticlesCount = R.path(['articlesCount'])

export const getPageNumbers = derive([getArticlesCount],
  articlesCount => R.range(1, R.inc(Math.ceil(articlesCount / ARTICLES_PER_PAGE))))

const getSelectedTabBase = R.path(['selectedTab'])

export const getSelectedTab = derive([getUser, getSelectedTabBase],
  (user, selectedTab) => selectedTab || (user ? tabNames.FEED : tabNames.ALL))

export const getArticleFilters = R.path(['articleFilters'])

export const getPage = derive([getArticleFilters], R.propOr(1, 'page'))
export const getComments = R.pathOr([], ['comments'])
export const getArticleId = derive([getRouteParams], R.prop('id'))
export const getArticlesById = derive([getArticles], R.indexBy(R.prop('slug')))
