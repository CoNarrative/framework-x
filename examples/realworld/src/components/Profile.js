import React from 'react'
import * as R from 'ramda'
import { component, createSub, derive } from 'framework-x'
import { evt } from '../eventTypes'
import { getProfileUser, isViewingSelf } from '../profile/selectors'
import { routeIds } from '../routes'
import { getRouteId } from '../routes/selectors'
import { ArticleList } from './ArticleList'
import { NavLink } from './Header'
import { Link } from './Link'
import { dispatch } from '../store'

const followClassname = following =>
  ['btn', 'btn-sm', 'action-btn'].concat(
    following ? ['btn-secondary']
              : ['btn-outline-secondary']
  ).join(' ')

const FavoritesTabs = component('FavoritesTabs', createSub({
  getProfileUser,
  isFavoritesRoute: derive([getRouteId], x => x === routeIds.USER_FAVORITES)
}), ({ isFavoritesRoute, profileUser: { username } }) =>
  isFavoritesRoute ? (
    <React.Fragment>
      <NavLink
        className="nav-link"
        to={[routeIds.USER, { username }]}>
        My Articles
      </NavLink>
      <NavLink
        className="nav-link active"
        to={[routeIds.USER_FAVORITES, { username }]}>
        Favorited Articles
      </NavLink>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <NavLink
        className="nav-link active"
        to={[routeIds.USER, { username }]}>
        My Articles
      </NavLink>
      <NavLink
        to={[routeIds.USER_FAVORITES, { username }]}>
        Favorited Articles
      </NavLink>
    </React.Fragment>
  ))

export const Profile = component('Profile', createSub({
    getProfileUser,
    isViewingSelf
  }), ({ isViewingSelf, profileUser: { username, image, bio, following } }) =>
    <div className="profile-page">
      <div className="user-info">
        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <img src={image} className="user-img" alt={username} />
              <h4>{username}</h4>
              <p>{bio}</p>
              {isViewingSelf
               ? <Link
                 to={[routeIds.SETTINGS]}
                 className="btn btn-sm btn-outline-secondary action-btn">
                 <i className="ion-gear-a" /> Edit Profile Settings
               </Link>
               : <button
                 className={followClassname(following)}
                 onClick={() => dispatch(evt.USER_REQUESTS_TOGGLE_FOLLOWING, [username, R.not(following)])}>
                 <i className="ion-plus-round" />
                 &nbsp;
                 {following ? 'Unfollow' : 'Follow'} {username}
               </button>}
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <FavoritesTabs />
              </ul>
            </div>
            <ArticleList />
          </div>
        </div>
      </div>
    </div>
)
