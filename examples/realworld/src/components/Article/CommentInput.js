import React from 'react'
import { component, createSub } from 'framework-x'
import { getCommentForm } from '../../comments/selectors'
import { evt } from '../../eventTypes'
import { getUser } from '../../user/selectors'
import { dispatch } from '../../store'


export const CommentInput = component('CommentInput', createSub({
  getCommentForm,
  getUser
}), ({
  commentForm: { body }, user
}) => {
  return (
    <form className="card comment-form" onSubmit={this.createComment}>
      <div className="card-block">
          <textarea className="form-control"
                    placeholder="Write a comment..."
                    value={body}
                    onChange={
                      e => dispatch(evt.SET_KV, [['comment', 'form', 'body'], e.target.value])}
                    rows="3">
          </textarea>
      </div>
      <div className="card-footer">
        <img
          src={user.image}
          className="comment-author-img"
          alt={user.username} />
        <button
          className="btn btn-sm btn-primary"
          type="button"
          onClick={() => dispatch(evt.USER_REQUESTS_POST_COMMENT)}>
          Post Comment
        </button>
      </div>
    </form>
  )
})
