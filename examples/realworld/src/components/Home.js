import React from 'react'
import { component, createSub } from 'framework-x'
import { getSelectedTab } from '../articles/selectors'
import { APP_NAME, tabNames } from '../constants'
import { evt } from '../eventTypes'
import { getSelectedTag } from '../tags/selectors'
import { getUser } from '../user/selectors'
import { ArticleList } from './ArticleList'
import { dispatch } from '../store'
import { NavLink } from './Link'
import { isLoggedIn } from '../auth/selectors'
import { Tags } from '../tags/views'


const YourFeedTab = ({ isSelected }) =>
  <NavLink className={isSelected ? 'nav-link active' : 'nav-link'}
           onClick={() => dispatch(evt.CHANGE_TAB, tabNames.FEED)}>
    Your Feed
  </NavLink>


const GlobalFeedTab = ({ isSelected }) =>
  <NavLink className={isSelected ? 'nav-link active' : 'nav-link'}
           onClick={() => dispatch(evt.CHANGE_TAB, tabNames.ALL) }>
    Global Feed
  </NavLink>


const TagFilterTab = ({ tag }) =>
  <NavLink className="nav-link active" onClick={()=>{}}>
      <i className="ion-pound" /> {tag}
  </NavLink>


const MainView = component('MainView',
  createSub({ getUser, getSelectedTab, getSelectedTag }),
  ({ user, selectedTag, selectedTab }) =>
    <div className="col-md-9">
      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">
          {user && <YourFeedTab isSelected={selectedTab === tabNames.FEED} />}
          <GlobalFeedTab isSelected={selectedTab === tabNames.ALL} />
          {selectedTab === tabNames.TAG && <TagFilterTab tag={selectedTag} />}
        </ul>
      </div>
      <ArticleList />
    </div>
)

const Banner = () =>
  <div className="banner">
    <div className="container">
      <h1 className="logo-font">{APP_NAME.toLowerCase()}</h1>
      <p>A place to share your knowledge.</p>
    </div>
  </div>


export const Home = () =>
  <div className="home-page">
    {!isLoggedIn() && <Banner />}
    <div className="container page">
      <div className="row">
        <MainView />
        <div className="col-md-3">
          <div className="sidebar">
            <p>Popular Tags</p>
            <Tags />
          </div>
        </div>
      </div>
    </div>
  </div>


