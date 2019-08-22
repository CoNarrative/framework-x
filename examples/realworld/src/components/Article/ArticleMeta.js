import * as api from '../../api'
import { evt } from '../../eventTypes'
import { routeIds } from '../../routes'
import { dispatch } from '../../store'
import { Link } from '../Link'
import React from 'react'

const ArticleActions = ({ slug }) =>
  <React.Fragment>
    <Link to={[routeIds.EDIT_STORY, { id: slug }]}
          className="btn btn-outline-secondary btn-sm">
      <i className="ion-edit" /> Edit Article
    </Link>
    <button className="btn btn-outline-danger btn-sm"
            onClick={() => dispatch(evt.API_REQUEST, [evt.DELETE_ARTICLE, api.articles.del(slug)])}>
      <i className="ion-trash-a" /> Delete Article
    </button>
  </React.Fragment>

export const ArticleMeta = ({ article, canModify }) =>
  <div className="article-meta">
    <Link to={[routeIds.USER, { username: article.author.username }]}>
      <img src={article.author.image} alt={article.author.username} />
    </Link>
    <div className="info">
      <Link to={[routeIds.USER, { username: article.author.username }]}
            className="author">
        {article.author.username}
      </Link>
      <span className="date">{new Date(article.createdAt).toDateString()}</span>
    </div>
    {canModify && <ArticleActions slug={article.slug} />}
  </div>
