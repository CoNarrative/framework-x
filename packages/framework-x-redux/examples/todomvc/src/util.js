// from redux
export function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}

export const toReduxEvent = (...event) => {
  let head, tail
  if (Array.isArray(event[0])) {
    head = event[0][0]
    tail = event[0].slice(1)
  } else {
    head = event[0]
    tail = event.slice(1)
  }
  switch (tail.length) {
    case 0:
      return { type: head }
    case  1:
      const arg = tail[0]
      return isPlainObject(arg)
             ? { type: head, ...arg }
             : { type: head, payload: arg }
    default:
      return { type: head, payload: tail }
  }
}

const toFrameworkXEvent = ({ type, ...rest }) => {
  // always converts to one arg events
  // if it's a {type, payload} object use the the payload as the arg
  // otherwise arg is the action minus the `type` key
  if (isPlainObject(rest) && rest.payload && Object.keys(rest).length === 1) {
    return [type, rest.payload]
  } else {
    return [type, rest]
  }
}
export const assoc = (k, v) => m => Object.assign({}, m, { [k]: v })

export const not = x => !x

