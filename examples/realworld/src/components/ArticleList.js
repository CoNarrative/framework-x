import { component, createSub } from 'framework-x'
import { getArticles, getArticlesCount, getCurrentPageIndex } from '../articles/selectors'
import { ArticlePreview } from './ArticlePreview'
import { ListPagination } from './ListPagination'
import React from 'react'

export const ArticleList = component('ArticleList',
  createSub({ getArticles, getArticlesCount, getCurrentPage: getCurrentPageIndex }),
  ({ articles, articlesCount, currentPage }) =>
    articles.length === 0 ? (
      <div className="article-preview">
        No articles are here... yet.
      </div>
    ) : (
      <div>
        {articles.map((article, i) =>
          <ArticlePreview key={i} article={article} />
        )}
        <ListPagination />
      </div>
    )
)

