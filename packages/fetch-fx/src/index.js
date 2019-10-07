import curry from 'ramda/es/curry'
import dissoc from 'ramda/es/dissoc'
import assoc from 'ramda/es/assoc'
import pick from 'ramda/es/pick'

const keys = ['body', 'bodyUsed', 'ok', 'status', 'statusText', 'headers', 'redirected', 'url', 'type']
const fetchFx = curry(
  ({ dispatch, fetch }, env, [urlOrReq, successEventOrEventVector, failureEventOrEventVector]) => {
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

  let req = urlOrReq
  if (typeof urlOrReq !== 'string') {
    req = new Request(urlOrReq.url, dissoc('url', urlOrReq))
  }
  (async () => {
    const res = await fetch(req)
      .catch(e => dispatch(failureEventName,
        isVector.failure
        ? { res: e, args: failureEventOrEventVector[1] }
        : e))
    const data = pick(keys, res)
    const json = await res.json().catch(e => console.error('error .json()ing', e))
    if (res.ok) {
      dispatch(successEventName, isVector.success ? {
        res: assoc('json', json, data),
        args: successEventOrEventVector[1]
      } : assoc('json', json, data))
    } else {
      dispatch(failureEventName,
        isVector.failure
        ? { res: assoc('json', json, data), args: failureEventOrEventVector[1] }
        : assoc('json', json, data),)
    }
  })()
})

export const createFx = ({ dispatch, fetch = fetch }) =>
  fetchFx({ dispatch, fetch })

