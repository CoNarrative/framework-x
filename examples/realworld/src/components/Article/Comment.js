import React from 'react'
import { evt } from '../../eventTypes'
import { routeIds } from '../../routes'
import { Link } from '../Link'
import  {dispatch} from '../../store'

export const Comment = ({ slug, comment: { id, author: { username, image }, body, createdAt }, canModify }) => {
  return (
    <div className="card">
      <div className="card-block">
        <p className="card-text">{body}</p>
      </div>
      <div className="card-footer">
        <Link
          to={[routeIds.USER, { username }]}
          className="comment-author">
          <img src={image} className="comment-author-img"
               alt={username} />
        </Link>
        &nbsp;
        <Link
          to={[routeIds.USER, { username }]}
          className="comment-author">
          {username}
        </Link>
        <span className="date-posted">
          {new Date(createdAt).toDateString()}
        </span>
        {canModify &&
         <span className="mod-options">
        <i className="ion-trash-a"
           onClick={() => dispatch(evt.USER_REQUESTS_DELETE_COMMENT, { id, slug, })} />
      </span>}
      </div>
    </div>
  )
}
