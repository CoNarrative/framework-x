import * as R from 'ramda'
import { dispatch, regFx } from './store'

export const fx = {
  db: (newStateOrReducer) => ['db', newStateOrReducer],
  dispatch: (...args) => ['dispatch', args],
  fetch: (urlOrReq, successEventName, failureEventName) =>
    ['fetch', [urlOrReq, successEventName, failureEventName]]
}

const keys = ['body', 'bodyUsed', 'ok', 'status', 'statusText', 'headers', 'redirected', 'url','type']
const fetchFx = ([urlOrReq, successEventName, failureEventName]) => {
  let awesomeness = urlOrReq
  if (typeof urlOrReq !== 'string') {
    awesomeness = new Request(urlOrReq.url, R.dissoc('url', urlOrReq))
  }
  (async () => {
    const res = await fetch(awesomeness).catch(e => dispatch(failureEventName, e))
    const data = R.pick(keys, res)
    const json = await res.json().catch(e => console.error('error .json()ing', e))
    if (res.ok) {
      dispatch(successEventName, R.assoc('json', json, data))
    } else {
      dispatch(failureEventName, R.assoc('json', json, data))
    }
  })()
}
regFx('fetch', fetchFx)
