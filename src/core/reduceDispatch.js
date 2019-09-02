/**
 * Takes a list of effects and reduces them.
 * Fxrs (fx handlers) can return more fx which are executed inline
 * @param reg
 * @param acc
 * @param effects
 * @returns {*}
 */
export function reduceFx(reg, acc, effects) {
  if (!effects) return acc
  // Accepts either map or array
  const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)
  // Process effects by reducing over them
  return effectsList.reduce(
    (acc, [fxType, fxPayload]) => {
      const fxr = reg.fxReg[fxType]
      if (!fxr) {
        throw new Error(`No fx handler for effect "${fxType}". Try registering a handler using "regFx('${fxType}', ({ effect }) => ({...some side-effect})"`)
      }
      // console.log('FXR', fxType, fxr)
      const nextAcc = fxr(reg, acc, fxPayload)
      // console.log('NEXT ACC', nextAcc)
      return nextAcc
    },
    acc,
  )
}

/**
 * A dispatch as a pure function that invokes all of the supplied helpers in the reg
 * to produce a resultant {db, fx} bag
 * @param reg
 * @param acc {db:{}, fx:{}}
 * @param type
 * @param payload
 * @returns {(function(*=, *=): function(*=, *=): *)|*}
 */
export function reduceDispatchReg(
  reg,
  acc,
  [type, payload] // fixme. Alex wants this to be the old ...event, signature to permit argument spreading
) {
  if (typeof type !== 'string') {
    throw new Error('attempted to dispatch empty or invalid type argument')
  }
  const eventHandlers = reg.eventFxReg[type]
  if (!eventHandlers) {
    const message = `No event -> fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`
    if (reg.onMissingHandler === 'ignore') {
      // do nothing
    } else if (reg.onMissingHandler === 'warn') {
      console.warn(message)
    } else {
      throw new Error(message)
    }
  }
  return eventHandlers.reduce(
    (acc, handler) => {
      const context = {
        db: acc.db,
        eventType: type,
        // fixme. Dynamically add helpers, etc.
      }
      acc = Object.assign({}, acc, { lastEventType: type })
      return reduceFx(reg, acc, handler(context, payload)) // fixme. Alex wants spread arguments
    },
    acc,
  )
}
