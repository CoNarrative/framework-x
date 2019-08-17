import { component, createSub } from 'framework-x'
import { canModifyArticle, getArticle } from '../../articles/selectors'
import {ArticleMeta} from './ArticleMeta'
import {Comments} from './Comments'
import React from 'react'
import marked from 'marked'


export const Article = component('Article', createSub({
  getArticle,
  canModifyArticle
}), ({ article, canModifyArticle }) => {
  if (!article.body) return null
  const markup = { __html: marked(article.body, { sanitize: true }) }
  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta
            article={article}
            canModify={canModifyArticle} />
        </div>
      </div>
      <div className="container page">
        <div className="row article-content">
          <div className="col-xs-12">
            <div dangerouslySetInnerHTML={markup} />
            <ul className="tag-list">
              {article.tagList.map(tag =>
                <li
                  className="tag-default tag-pill tag-outline"
                  key={tag}>
                  {tag}
                </li>
              ) }
            </ul>

          </div>
        </div>
        <hr />
        <div className="article-actions">
        </div>

        <div className="row">
          <Comments />
        </div>
      </div>
    </div>
  )
})
