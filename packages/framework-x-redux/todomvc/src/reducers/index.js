import { combineReducers } from './combineReducers'
import todos from './todos'
import counter from './counter'
import visibilityFilter from './visibilityFilter'

const rootReducer = combineReducers({
  todos,
  counter,
  visibilityFilter,
  cool: (state = null, action) => {
    console.log('cool reducer', state, action)
    return state
  }
})

export default rootReducer
