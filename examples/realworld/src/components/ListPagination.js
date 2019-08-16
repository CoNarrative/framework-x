import * as R from 'ramda'
import { component, createSub } from 'framework-x'
import React from 'react'
import {
  getArticlesCount,
  getCurrentPageIndex,
  getPageNumbers
} from '../articles/selectors'
import { SET_PAGE } from '../constants/actionTypes'
import { evt } from '../eventTypes'
import * as api from '../api'
import { getRouteId, getRouteQuery } from '../routes/selectors'
import { dispatch } from '../store'
import { Link } from './Link'

const ARTICLES_PER_PAGE = 10

export const ListPagination = component('ListPagination',
  createSub({ getPageNumbers, getCurrentPageIndex, getRouteId, getRouteQuery }),
  ({ pageNumbers, currentPageIndex, routeId, routeQuery }) => {
    console.log('cpi',currentPageIndex)
    if (R.isEmpty(pageNumbers)) {
      return null
    }
    return (
      <nav>
        <ul className="pagination">
          {pageNumbers.map(n => {
            const isCurrent = n === currentPageIndex
            return (
              <li key={n} className={isCurrent ? 'page-item active' : 'page-item'}>
                <Link className="page-link"
                      to={[routeId, {}, R.assoc('offset', n * ARTICLES_PER_PAGE, routeQuery)]}
                >
                  {n + 1}
                </Link>
              </li>
            )
          })}
      </ul>
      </nav>
    )
  })
