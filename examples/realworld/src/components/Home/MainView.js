import React from 'react'
import { component, createSub } from 'framework-x'
import { getSelectedTab } from '../../articles/selectors'
import { tabNames } from '../../constants'
import { evt } from '../../eventTypes'
import { getSelectedTag } from '../../tags/selectors'
import { getUser } from '../../user/selectors'
import { ArticleList } from '../ArticleList'
import { dispatch } from '../../store'


const YourFeedTab = ({ isSelected }) =>
  <li className="nav-item">
    <a href=""
       className={isSelected ? 'nav-link active' : 'nav-link'}
       onClick={e => {
         e.preventDefault()
         dispatch(evt.CHANGE_TAB, tabNames.FEED)
       }}>
      Your Feed
    </a>
  </li>

const GlobalFeedTab = ({ isSelected }) =>
  <li className="nav-item">
    <a className={isSelected ? 'nav-link active' : 'nav-link'}
       onClick={e => {
         e.preventDefault()
         dispatch(evt.CHANGE_TAB, tabNames.ALL)
       }}>
      Global Feed
    </a>
  </li>

const TagFilterTab = ({ tag }) =>
  <li className="nav-item">
    <a href="" className="nav-link active">
      <i className="ion-pound" /> {tag}
    </a>
  </li>

export const MainView = component('MainView', createSub({
  getUser,
  getSelectedTab,
  getSelectedTag
}), ({ user, selectedTag, selectedTab }) => {
  return (
    <div className="col-md-9">
      <div className="feed-toggle">
        <ul className="nav nav-pills outline-active">
          {user && <YourFeedTab isSelected={selectedTab === tabNames.FEED} />}
          <GlobalFeedTab isSelected={selectedTab === tabNames.ALL} />
          {selectedTag && <TagFilterTab tag={selectedTag} />}
        </ul>
      </div>
      <ArticleList />
    </div>
  )
})
