import * as R from 'ramda'
export const getProfileForm = R.path(['profile'])
export const getProfileFormLoading = R.path(['profile','isLoading'])
export const getProfileFormErrors = R.path(['profile','errors'])
