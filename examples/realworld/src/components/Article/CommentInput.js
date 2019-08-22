import React from 'react'
import { component, createSub } from 'framework-x'
import { getCommentForm } from '../../comments/selectors'
import { evt } from '../../eventTypes'
import { getUser } from '../../user/selectors'
import { dispatch } from '../../store'


export const CommentInput = component('CommentInput',
  createSub({ getCommentForm, getUser }), ({ commentForm: { body }, user }) =>
    <form className="card comment-form">
      <div className="card-block">
          <textarea className="form-control" placeholder="Write a comment..." rows="3"
                    value={body}
                    onChange={({ target: { value } }) =>
                      dispatch(evt.SET_KV, [['comment', 'form', 'body'], value])} />
      </div>
      <div className="card-footer">
        <img src={user.image} className="comment-author-img" alt={user.username} />
        <button className="btn btn-sm btn-primary" type="button"
                onClick={() => dispatch(evt.USER_REQUESTS_POST_COMMENT)}>
          Post Comment
        </button>
      </div>
    </form>
)
