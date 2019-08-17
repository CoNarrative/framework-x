import { derive } from 'framework-x'
import * as R from 'ramda'
import { ARTICLES_PER_PAGE, tabNames } from '../constants'
import { getUser } from '../user/selectors'


export const getArticles = R.path(['articles'])

export const getArticlesCount = R.path(['articlesCount'])

export const getPageNumbers = derive([getArticlesCount],
  articlesCount => R.range(1, R.inc(Math.ceil(articlesCount / ARTICLES_PER_PAGE))))

const getSelectedTabBase = R.path(['selectedTab'])

export const getSelectedTab = derive([getUser, getSelectedTabBase],
  (user, selectedTab) => selectedTab || (user ? tabNames.FEED : tabNames.ALL))

export const getArticleFilters = R.path(['articleFilters'])

export const getPage = derive([getArticleFilters], R.propOr(1, 'page'))
