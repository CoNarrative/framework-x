import * as R from 'ramda'
import { dispatch, regFx } from './store'

export const fx = {
  db: (newStateOrReducer) => ['db', newStateOrReducer],
  dispatch: (...args) => ['dispatch', args],
  fetch: (urlOrReq, successEventName, failureEventName) =>
    ['fetch', [urlOrReq, successEventName, failureEventName]]
}

const fetchFx = ([urlOrReq, successEventName, failureEventName]) => {
  let awesomeness = urlOrReq
  if (typeof urlOrReq !== 'string') {
    awesomeness = new Request(urlOrReq.url, R.dissoc('url', urlOrReq))
  }
  fetch(awesomeness)
    .then(x => x.json())
    .then(x => dispatch(successEventName, x))
    .catch(e => dispatch(failureEventName, e))
}
regFx('fetch', fetchFx)
