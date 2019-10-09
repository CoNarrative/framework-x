import * as R from 'ramda'

export const getCommentForm = R.pathOr({}, ['comment', 'form'])
export const getCommentErrors = R.path(['comment','errors'])
