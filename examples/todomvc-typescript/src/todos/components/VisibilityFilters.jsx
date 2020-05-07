import React from 'react';
import { component, createSub } from 'framework-x';
import { visibilityFilter } from '../../constants';
import { evt } from '../../eventTypes';
import { getVisibilityFilter } from '../selectors';
const visibilityFilters = [
    {
        id: visibilityFilter.ALL,
        label: 'All',
        event: [evt.CHANGE_FILTER, visibilityFilter.ALL]
    },
    {
        id: visibilityFilter.NOT_DONE,
        label: 'Active',
        event: [evt.CHANGE_FILTER, visibilityFilter.NOT_DONE]
    },
    {
        id: visibilityFilter.DONE,
        label: 'Completed',
        event: [evt.CHANGE_FILTER, visibilityFilter.DONE]
    },
];
export const VisibilityFilters = component('VisibilityFilters', createSub({ selectedFilter: getVisibilityFilter }), ({ dispatch, selectedFilter }) => <ul className="filters">
      {visibilityFilters.map(({ id, label, event }, i) => <li key={i}>
          <a className={id === selectedFilter ? 'selected' : undefined} onClick={() => dispatch(...event)}>
            {label}
          </a>
        </li>)}
    </ul>);
