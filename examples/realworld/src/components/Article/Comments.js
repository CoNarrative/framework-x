import React from 'react'
import { component, createSub } from 'framework-x'
import { getArticleId, getComments } from '../../articles/selectors'
import { getCommentErrors } from '../../comments/selectors'
import { routeIds } from '../../routes'
import { getUser } from '../../user/selectors'
import { Link } from '../Link'
import { ListErrors } from '../ListErrors'
import { Comment } from './Comment'
import { CommentInput } from './CommentInput'


const canModify = (comment, user) => comment.author.username === user.username

export const Comments = component('Comments',
  createSub({ getComments, getCommentErrors, getUser, slug: getArticleId }),
  ({ comments, errors, user, slug }) => {
    return user ? (
      <div className="col-xs-12 col-md-8 offset-md-2">
        <div>
          {errors && <ListErrors errors={errors} />}
          <CommentInput />
        </div>

        <div>
          {comments.map((comment, i) =>
            <Comment key={i} {...{ slug, comment, canModify: canModify(comment, user) }} /> )}
        </div>
      </div>
    ) : (
      <div className="col-xs-12 col-md-8 offset-md-2">
        <p>
          <Link to={[routeIds.LOGIN]}>Sign in</Link>{" "}or{" "}
          <Link to={[routeIds.REGISTER]}>sign up</Link>{" "}to add comments on this article.
        </p>
        <div>
          {comments.map((comment, i) =>
            <Comment key={i}  {...{ comment, slug, canModify: canModify(comment, user) }} />)}
        </div>
      </div>
   )
})
