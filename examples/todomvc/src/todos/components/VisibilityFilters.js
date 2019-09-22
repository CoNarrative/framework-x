import { component, createSub } from 'framework-x'
import React from 'react'
import { visibilityFilter } from '../../constants'
import { evt } from '../../eventTypes'
import { dispatch } from '../../store'
import { getVisibilityFilter } from '../selectors'

const visibilityFilters = [
  {
    id: visibilityFilter.DONE,
    label: 'Show done',
    event: [evt.CHANGE_FILTER, visibilityFilter.DONE]
  },
  {
    id: visibilityFilter.NOT_DONE,
    label: 'Show not done',
    event: [evt.CHANGE_FILTER, visibilityFilter.NOT_DONE]
  },
  {
    id: visibilityFilter.ALL,
    label: 'Show all',
    event: [evt.CHANGE_FILTER, visibilityFilter.ALL]
  }
]

const visibilityButtonStyle = (isSelected) =>
  isSelected
  ? { background: 'green', color: 'white' }
  : {}

export const VisibilityFilters = component('VisibilityFilters',
  createSub({ selectedFilter: getVisibilityFilter }),
  ({ selectedFilter }) =>
    <div>
      {visibilityFilters.map(({ id, label, event }, i) =>
        <button
          key={i}
          style={visibilityButtonStyle(id === selectedFilter)}
          onClick={() => dispatch(...event)}>
          {label}
        </button>
      )}
    </div>
)
