import React from 'react'
import { isLoggedIn } from '../../auth/selectors'
import { Banner } from './Banner'
import { MainView } from './MainView'
import { Tags } from '../../tags/views'


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


