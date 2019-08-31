/**
 * A dispatch as a pure function that invokes all of the supplied helpers in the def
 * to produce a resultant {db, fx} bag
 * @param def
 * @param acc {db:{}, fx:{}}
 * @param type
 * @param payload
 * @returns {(function(*=, *=): function(*=, *=): *)|*}
 */
export function reduceDispatchDef(
  def,
  acc,
  [type, payload] // fixme. Alex wants this to be the old ...event, signature to permit argument spreading
) {
  const eventHandlers = def.eventFxReg[type]
  if (!eventHandlers) {
    const message = `No event -> fx handler for dispatched event "${type}". Try registering a handler using "regEventFx('${type}', ({ db }) => ({...some effects})"`
    if (def.onMissingHandler === 'ignore') {
      // do nothing
    } else if (def.onMissingHandler === 'warn') {
      console.warn(message)
    } else {
      throw new Error(message)
    }
  }
  const { fxReg, fxReducerReg } = def
  return eventHandlers.reduce(
    (acc, handler) => {
      const context = {
        db: acc.db,
        eventType: def,
        // fixme. Dynamically add helpers, etc.
      }
      const effects = handler(context, payload) // fixme. Alex wants spread arguments
      if (!effects) return
      // Accepts either map or array
      const effectsList = Array.isArray(effects) ? effects : Object.entries(effects)
      // Process effects by reducing over them
      return effectsList.reduce(
        (acc, [fxType, fxPayload]) => {
          // we only care that they have a fx performer registered.
          // They don't have to register a reducer.
          if (!fxReg[fxType]) {
            throw new Error(`No fx handler for effect "${fxType}". Try registering a handler using "regFx('${fxType}', ({ effect }) => ({...some side-effect})"`)
          }
          const effect = fxReducerReg[fxType]
          return effect ? effect(def, acc, fxPayload) : acc
        },
        acc,
      )
    },
    acc,
  )
}
