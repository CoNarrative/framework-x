import React from 'react'
import * as R from 'ramda'
import { component, createSub } from 'framework-x'
import { getArticles, getArticleFilters, getPage, getPageNumbers } from '../articles/selectors'
import { evt } from '../eventTypes'
import { routeIds } from '../routes'
import * as api from '../api'
import { Link } from './Link'
import { dispatch } from '../store'


export const ListPagination = component('ListPagination',
  createSub({ getPageNumbers, getPage, getArticleFilters }),
  ({ pageNumbers, page, articleFilters }) =>
    R.isEmpty(pageNumbers) || pageNumbers.length === 1 ? null :
    <nav>
      <ul className="pagination">
        {pageNumbers.map(n =>
          <li key={n} className={n === page ? 'page-item active' : 'page-item'}>
            <div className="page-link"
                 onClick={() => dispatch(evt.UPDATE_ARTICLE_FILTERS, R.assoc('page', n, articleFilters))}
            >{n}</div>
          </li>)}
      </ul>
    </nav>
)


export const ArticlePreview = ({ article }) => {
  const { favorited, author, createdAt, favoritesCount, tagList, slug: id, title, description } = article
  const { username, image } = author
  const favoriteButtonClass = favorited ? 'btn btn-sm btn-primary':'btn btn-sm btn-outline-primary'

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={[routeIds.USER, { username }]}><img src={image} alt={username} /></Link>

        <div className="info">
          <Link className="author" to={[routeIds.USER, { username }]}>{username}</Link>
          <span className="date">{new Date(createdAt).toDateString()}</span>
        </div>

        <div className="pull-xs-right">
          <button className={favoriteButtonClass}
                  onClick={e => {
                    e.preventDefault()
                    const args = [evt.ARTICLE_FAVORITED,
                      favorited ? api.articles.unfavorite(id) : api.articles.favorite(id)]
                    dispatch(evt.API_REQUEST, args)}}>
            <i className="ion-heart" /> {favoritesCount}
          </button>
        </div>
      </div>

      <Link to={[routeIds.ARTICLE, { id }]} className="preview-link">
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {tagList.map((tag, i) =>
            <li key={i} className="tag-default tag-pill tag-outline">{tag}</li>)}
        </ul>
      </Link>
    </div>
  )
}

export const ArticleList = component('ArticleList',
  createSub({ getArticles }), ({ articles }) =>
    articles.length === 0
    ? <div className="article-preview">No articles are here... yet.</div>
    : <div>
      {articles.map((article, i) => <ArticlePreview key={i} article={article} />)}
      <ListPagination />
    </div>
)

