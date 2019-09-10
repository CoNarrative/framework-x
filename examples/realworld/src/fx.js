import { dispatch, regFx } from './store'
import { createFx } from '@framework-x/fetch-fx'

export const fx = {
  db: (newStateOrReducer) => ['db', newStateOrReducer],
  dispatch: (...args) => ['dispatch', args],
  fetch: (urlOrReq, successEventOrEventVector, failureEventOrEventVector) =>
    ['fetch', [urlOrReq, successEventOrEventVector, failureEventOrEventVector]]
}

regFx('fetch', createFx({dispatch,fetch:window.fetch}))
