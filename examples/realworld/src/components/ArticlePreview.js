import React from 'react'
import { evt } from '../eventTypes'
import { routeIds } from '../routes'
import * as api from '../api'
import { Link } from './Link'
import {dispatch} from '../store'

const FAVORITED_CLASS = 'btn btn-sm btn-primary'
const NOT_FAVORITED_CLASS = 'btn btn-sm btn-outline-primary'


export const ArticlePreview = ({ article }) => {
  const {
    favorited, author, createdAt, favoritesCount, tagList, slug: id,
    title, description
  } = article
  const { username, image } = author
  const favoriteButtonClass = favorited ? FAVORITED_CLASS : NOT_FAVORITED_CLASS

  return (
    <div className="article-preview">
      <div className="article-meta">
        <Link to={[routeIds.USER, { username }]}>
          <img src={image} alt={username} />
        </Link>

        <div className="info">
          <Link className="author" to={[routeIds.USER, { username }]}>
            {username}
          </Link>
          <span className="date">
            {new Date(createdAt).toDateString()}
          </span>
        </div>

        <div className="pull-xs-right">
          <button className={favoriteButtonClass}
                  onClick={e => {
                    e.preventDefault()
                    const args = favorited
                                 ? [evt.ARTICLE_UNFAVORITED, api.articles.unfavorite(id)]
                                 : [evt.ARTICLE_FAVORITED, api.articles.favorite(id)]
                    dispatch(evt.API_REQUEST, args)
                  }}>
            <i className="ion-heart" /> {favoritesCount}
          </button>
        </div>
      </div>

      <Link to={[routeIds.ARTICLE, { id }]} className="preview-link">
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Read more...</span>
        <ul className="tag-list">
          {tagList.map((tag,i) =>
            <li key={i} className="tag-default tag-pill tag-outline" >
              {tag}
            </li>
          )}
        </ul>
      </Link>
    </div>
  )
}

