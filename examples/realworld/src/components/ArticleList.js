import React from 'react'
import { component, createSub } from 'framework-x'
import { getArticles } from '../articles/selectors'
import { ArticlePreview } from './ArticlePreview'
import { ListPagination } from './ListPagination'

export const ArticleList = component('ArticleList',
  createSub({ getArticles }), ({ articles }) =>
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

