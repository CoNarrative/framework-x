import { regEventFx } from './store'

regEventFx('increment', ({ db }, [_, incrementBy]) => ({
  db: { ...db, count: db.count + incrementBy },
}))