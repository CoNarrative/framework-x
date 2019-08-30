function is(x, y) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y
  } else {
    return x !== x && y !== y
  }
}

const hasOwn = Object.prototype.hasOwnProperty
export const memoize = (fn) => {
  let cache = {}
  return (...args) => {
    let n = args[0] // just taking one argument here
    if (n in cache) {
      // console.log('Fetching from cache');
      return cache[n]
    } else {
      // console.log('Calculating result');
      let result = fn(n)
      cache[n] = result
      return result
    }
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
