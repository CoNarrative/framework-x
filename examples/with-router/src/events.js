import { dispatch, regEventFx } from './store'

regEventFx('initialize-db', () => ({
  db: {
    count: 5,
    otherwise: false,
  },
}))

regEventFx('increment', ({ db }, [_, incrementBy]) => ({
  db: { ...db, count: db.count + incrementBy },
}))

regEventFx('otherwise', ({ db }, [_, incrementBy]) => ({
  db: { ...db, otherwise: !db.otherwise },
}))

