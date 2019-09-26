import * as R from 'ramda'
import {derive}  from 'framework-x'

export const editing = R.path(['editing'])
export const editedEvent = derive([editing], R.path(['event']))
