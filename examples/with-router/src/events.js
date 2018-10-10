import { dispatch, regEventFx } from './store'

regEventFx('initialize-db', () => ({
  db: {
    count: 5,
    otherwise: false
  }
}))

regEventFx('increment', ({ db }, _, incrementBy) => ({
  db: { ...db, count: db.count + incrementBy }
}))

// an example of doing it with a "reducer function"
regEventFx('otherwise', () => ({
  db: db => ({ ...db, otherwise: !db.otherwise })
}))

regEventFx('otherwise', () => {
  console.log('alternate handler(example)')
  return {}
})
