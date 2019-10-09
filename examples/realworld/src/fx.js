
export const fx = {
  db: (newStateOrReducer) => ['db', newStateOrReducer],
  dispatch: (...args) => ['dispatch', args],
  fetch: (urlOrReq, successEventOrEventVector, failureEventOrEventVector) =>
    ['fetch', [urlOrReq, successEventOrEventVector, failureEventOrEventVector]],
  localStorageUnsetToken: () => ['localStorage', ['removeItem', ['jwt']]],
  localStorageSetToken: (token) => ['localStorage', ['setItem', ['jwt', token]]]
}


export const localStorageFx = ({ localStorage, setState }) =>
  (env, fnOrMethodArgs) => {
    if (typeof fnOrMethodArgs === 'function') {
      fnOrMethodArgs(localStorage, setState)
      return
    }
    localStorage[fnOrMethodArgs[0]](...fnOrMethodArgs[1])
  }
