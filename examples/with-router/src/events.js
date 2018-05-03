import {  startRouter } from './routing'
import { dispatch, regEventFx } from './store'

regEventFx('initialize', () => {
  startRouter(locationAndMatch => {
    console.log('router started. dispatching initial route-change event')
    dispatch('route-change', locationAndMatch)
  })
  return {}
})

regEventFx('initialize', () => ({
  db: {
    count: 5,
  },
}))

regEventFx('increment', ({ db }, [_, incrementBy]) => ({
  db: { ...db, count: db.count + incrementBy },
}))
