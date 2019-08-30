import * as R from 'ramda'

export const getEditorForm = R.pathOr({}, ['editor', 'form'])
export const getEditorErrors = R.path(['editor', 'errors'])
export const getEditorLoading = R.path(['editor', 'isLoading'])
