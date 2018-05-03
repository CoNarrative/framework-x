import { dispatch, regEventFx } from './store'

regEventFx('initialize-db', () => ({
  db: {
    count: 5,
  },
}))

regEventFx('increment', ({ db }, [_, incrementBy]) => ({
  db: { ...db, count: db.count + incrementBy },
}))
