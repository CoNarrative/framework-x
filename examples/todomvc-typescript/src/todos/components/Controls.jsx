import React from 'react';
import { component, createSub } from 'framework-x';
import * as R from 'ramda';
import { evt } from '../../eventTypes';
import { dispatch } from '../../store';
import { getAllTodosCount, getDoneCount, getNotDoneCount } from '../selectors';
const buttons = ({ canMarkAllDone, canClearAll, canClearAllDone }) => [
    {
        label: 'Mark all done',
        enabled: canMarkAllDone,
        event: [evt.MARK_ALL_DONE],
    },
    {
        label: 'Clear all done',
        enabled: canClearAllDone,
        event: [evt.CLEAR_ALL_DONE]
    },
    {
        label: 'Clear all',
        enabled: canClearAll,
        event: [evt.CLEAR_ALL]
    },
];
export const Controls = component('Controls', createSub({
    canMarkAllDone: R.pipe(getNotDoneCount, n => n > 0),
    canClearAllDone: R.pipe(getDoneCount, n => n > 0),
    canClearAll: R.pipe(getAllTodosCount, n => n > 0)
}), ({ canMarkAllDone, canClearAllDone, canClearAll }) => {
    return (<div>
        {buttons({ canMarkAllDone, canClearAll, canClearAllDone })
        .map(({ label, enabled, event }, i) => {
        return <button key={i} disabled={!enabled} onClick={() => dispatch(...event)}>
            {label}
          </button>;
    })}
      </div>);
});
