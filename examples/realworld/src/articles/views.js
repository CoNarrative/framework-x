import React from 'react'
import { component, createSub } from 'framework-x'
import { canModifyArticle, getArticle, getArticleId, getComments } from './selectors'
import { getCommentErrors, getCommentForm } from '../comments/selectors'
import { getUser } from '../user/selectors'
import { ListErrors } from '../components/ListErrors'
import marked from 'marked'
import * as api from '../api'
import { evt } from '../eventTypes'
import { routeIds } from '../routes'
import { dispatch } from '../store'
import { Link } from '../components/Link'


const CommentInput = component('CommentInput',
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


const Comment = ({ slug, comment: { id, author: { username, image }, body, createdAt }, canModify }) =>
  <div className="card">
    <div className="card-block">
      <p className="card-text">{body}</p>
    </div>
    <div className="card-footer">
      <Link to={[routeIds.USER, { username }]} className="comment-author">
        <img src={image} className="comment-author-img" alt={username} />
      </Link>
      {" "}
      <Link to={[routeIds.USER, { username }]} className="comment-author">{username}</Link>
      <span className="date-posted">{new Date(createdAt).toDateString()}</span>
      {canModify &&
       <span className="mod-options">
        <i className="ion-trash-a"
           onClick={() => dispatch(evt.USER_REQUESTS_DELETE_COMMENT, { id, slug, })} />
      </span>}
    </div>
  </div>


const canModify = (comment, user) => comment.author.username === user.username

const Comments = component('Comments',
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

const ArticleActions = ({ slug }) =>
  <React.Fragment>
    <Link to={[routeIds.EDIT_STORY, { id: slug }]}
          className="btn btn-outline-secondary btn-sm">
      <i className="ion-edit" /> Edit Article
    </Link>{' '}
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


export const Article = component('Article', createSub({ getArticle, canModifyArticle }),
  ({ article, canModifyArticle }) =>
    !article.body ? null :
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <ArticleMeta article={article} canModify={canModifyArticle} />
        </div>
      </div>
      <div className="container page">
        <div className="row article-content">
          <div className="col-xs-12">
            <div dangerouslySetInnerHTML={{ __html: marked(article.body, { sanitize: true }) }} />
            <ul className="tag-list">
              {article.tagList.map(tag =>
                <li key={tag} className="tag-default tag-pill tag-outline">{tag}</li>)}
            </ul>
          </div>
        </div>
        <hr />
        <div className="row">
          <Comments />
        </div>
      </div>
    </div>
)
