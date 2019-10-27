import { put, takeEvery, delay } from 'redux-saga/effects'
import { CLEAR_COMPLETED, COMPLETE_TODO } from '../constants/ActionTypes'

export function* incrementAsync() {
  console.log('[saga] incrementAsync')
  yield delay(1000)
  yield put({ type: 'INCREMENT' })
}
export function* clearCompletedAsync() {
  console.log('[saga] clearCompleted')
  yield delay(3000)
  yield put({ type: CLEAR_COMPLETED })
}
export default function* rootSaga() {
  console.log('[saga] rootSaga')
  yield takeEvery('INCREMENT_ASYNC', incrementAsync)
  yield takeEvery(COMPLETE_TODO, clearCompletedAsync)
}
