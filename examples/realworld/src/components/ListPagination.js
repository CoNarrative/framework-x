import * as R from 'ramda'
import { component, createSub } from 'framework-x'
import React from 'react'
import {
  getArticleFilters,
  getPage,
  getPageNumbers
} from '../articles/selectors'
import { evt } from '../eventTypes'
import { dispatch } from '../store'


export const ListPagination = component('ListPagination',
  createSub({ getPageNumbers, getPage, getArticleFilters }),
  ({ pageNumbers, page, articleFilters }) => {
    return R.isEmpty(pageNumbers) ? null : (
      <nav>
        <ul className="pagination">
          {pageNumbers.map(n => {
            const isCurrent = n === page
            return (
              <li key={n} className={isCurrent ? 'page-item active' : 'page-item'}>
                <div className="page-link"
                     onClick={() => dispatch([evt.UPDATE_ARTICLE_FILTERS, R.assoc('page', n, articleFilters)])}
                >
                  {n}
                </div>
              </li>
            )
          })}
        </ul>
      </nav>
    )
  })
