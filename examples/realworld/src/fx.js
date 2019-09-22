import * as R from 'ramda'
import { regFx } from './store'

export const fx = {
  db: (newStateOrReducer) => ['db', newStateOrReducer],
  dispatch: (...args) => ['dispatch', args],
  fetch: (urlOrReq, successEventOrEventVector, failureEventOrEventVector) =>
    ['fetch', [urlOrReq, successEventOrEventVector, failureEventOrEventVector]]
}

const keys = ['body', 'bodyUsed', 'ok', 'status', 'statusText', 'headers', 'redirected', 'url', 'type']
const fetchFx = (env, [urlOrReq, successEventOrEventVector, failureEventOrEventVector]) => {
  let isVector = { success: true, failure: true }
  let successEventName = successEventOrEventVector
  let failureEventName = failureEventOrEventVector
  if (typeof successEventOrEventVector === 'string') {
    isVector.success = false
  } else {
    successEventName = successEventOrEventVector[0]
  }
  if (typeof failureEventOrEventVector === 'string') {
    isVector.failure = false
  } else {
    failureEventName = failureEventOrEventVector[0]
  }

  let awesomeness = urlOrReq
  if (typeof urlOrReq !== 'string') {
    awesomeness = new Request(urlOrReq.url, R.dissoc('url', urlOrReq))
  }
  (async () => {
    const res = await fetch(awesomeness)
      .catch(e => env.fx.dispatch(env, [failureEventName,
        isVector.failure
        ? { res: e, args: failureEventOrEventVector[1] }
        : e]))
    const data = R.pick(keys, res)
    const json = await res.json().catch(e => console.error('error .json()ing', e))
    if (res.ok) {
      env.fx.dispatch(env, [successEventName, isVector.success ? {
        res: R.assoc('json', json, data),
        args: successEventOrEventVector[1]
      } : R.assoc('json', json, data)])
    } else {
      env.fx.dispatch(env, [failureEventName,
        isVector.failure
        ? { res: R.assoc('json', json, data), args: failureEventOrEventVector[1] }
        : R.assoc('json', json, data)])
    }
  })()
}
regFx('fetch', fetchFx)
