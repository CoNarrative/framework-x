const hasOwn = Object.prototype.hasOwnProperty
export const memoize = (fn) => {
  let cache = {};
  return (...args) => {
    let n = args[0];  // just taking one argument here
    if (n in cache) {
      // console.log('Fetching from cache');
      return cache[n];
    }
    else {
      // console.log('Calculating result');
      let result = fn(n);
      cache[n] = result;
      return result;
    }
  }
}

function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

export function shallowEqual(objA, objB) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (!hasOwn.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }
  return true
}

export function shallowEqualSkip(objA, objB, skip) {
  if (is(objA, objB)) return true

  if (typeof objA !== 'object' || objA === null ||
      typeof objB !== 'object' || objB === null) {
    return false
  }

  const keysA = Object.keys(objA)
  const keysB = Object.keys(objB)

  if (keysA.length !== keysB.length) return false

  for (let i = 0; i < keysA.length; i++) {
    if (skip.indexOf(keysA[i]) > -1) return
    if (!hasOwn.call(objB, keysA[i]) ||
        !is(objA[keysA[i]], objB[keysA[i]])) {
      return false
    }
  }

  return true
}

function defaultEqualityCheck(a, b) {
  return a === b
}

function areArgumentsShallowlyEqual(equalityCheck, prev, next) {
  if (prev === null || next === null || prev.length !== next.length) {
    return false
  }

  // Do this in a for loop (and not a `forEach` or an `every`) so we can determine equality as fast as possible.
  const length = prev.length
  for (let i = 0; i < length; i++) {
    if (!equalityCheck(prev[i], next[i])) {
      return false
    }
  }

  return true
}

function hash(obj) {
  return JSON.stringify(obj)
}

export function defaultMemoize(func) {
  let lastArgs = null
  let lastResult = null
  // we reference arguments instead of spreading them for performance reasons
  return function () {
    const logIt = func.selector && func.selector.logIt
    const name = func.selector ? func.selector.selectorName : null
    const useValueHash = func.selector ? func.selector.useValueHash : null
    // const start = performance.now()
    let args = useValueHash ? hash(arguments) : arguments
    const is = useValueHash ? (a, b) => a===b :
               (a,b) => areArgumentsShallowlyEqual(defaultEqualityCheck, a, b)
    // if (logIt) {
    //   console.log(`${name} hash: ${performance.now() - start}ms`)
    // }
    if (!is(lastArgs, args)) {
      if (logIt) {
        console.log('failed equality check',
          name, {
            lastArgs,
            args,
          })
      }
      // apply arguments instead of spreading for performance.
      lastResult = func.apply(null, arguments)
    }

    lastArgs = args
    return lastResult
  }
}

function getDependencies(funcs) {
  const dependencies = Array.isArray(funcs[0]) ? funcs[0] : funcs

  if (!dependencies.every(dep => typeof dep === 'function')) {
    const dependencyTypes = dependencies.map(
      dep => typeof dep,
    ).join(', ')
    throw new Error(
      'Selector creators expect all input-selectors to be functions, ' +
      `instead received the following types: [${dependencyTypes}]`,
    )
  }

  return dependencies
}

export function createSelectorCreator(memoize, ...memoizeOptions) {
  return (...funcs) => {
    let recomputations = 0
    const resultFunc = funcs.pop()
    const dependencies = getDependencies(funcs)

    let selector

    function recompute() {
      recomputations++
      if (selector.logIt && selector.selectorName) {
        console.log('recomputing', selector.selectorName)
      }
      // apply arguments instead of spreading for performance.
      return resultFunc.apply(null, arguments)
    }

    const memoizedResultFunc = memoize(
      recompute,
      ...memoizeOptions,
    )

    // If a selector is called with the exact same arguments we don't need to traverse our dependencies again.
    selector = memoize(function () {
      const params = []
      const length = dependencies.length

      for (let i = 0; i < length; i++) {
        // apply arguments instead of spreading and mutate a local list of params for performance.
        params.push(dependencies[i].apply(null, arguments))
      }

      // apply arguments instead of spreading for performance.
      // if (selector.selectorName) {
      //   console.log('fetching value from memoized result func', selector.selectorName, params)
      // }
      return memoizedResultFunc.apply(null, params)
    })
    recompute.selector = selector
    selector.resultFunc = resultFunc
    selector.memoizedResultFunc = memoizedResultFunc
    selector.dependencies = dependencies
    selector.recomputations = () => recomputations
    selector.resetRecomputations = () => recomputations = 0
    return selector
  }
}

export const createSelector = createSelectorCreator(defaultMemoize)

export function createStructuredSelector(selectors, selectorCreator = createSelector) {
  if (typeof selectors !== 'object') {
    throw new Error(
      'createStructuredSelector expects first argument to be an object ' +
      `where each property is a selector, instead received a ${typeof selectors}`,
    )
  }
  const objectKeys = Object.keys(selectors)
  return selectorCreator(
    objectKeys.map(key => selectors[key]),
    (...values) => {
      return values.reduce((composition, value, index) => {
        composition[objectKeys[index]] = value
        return composition
      }, {})
    },
  )
}

export const createSub = createStructuredSelector

export const derive = (...args) => {
  if (typeof(args[0]) === 'string') {
    const sel = createSelector.apply(null, args.slice(1))
    sel.selectorName = args[0]
    return sel
  }
  if (typeof(args[args.length - 1]) === 'object') {
    const { name, useValueHash } = args[args.length - 1]
    const sel = createSelector.apply(null, args.slice(0, args.length-1))
    if (name) sel.selectorName = name
    if (useValueHash) sel.useValueHash = useValueHash
    return sel
  }
  return createSelector.apply(null, args)
}
