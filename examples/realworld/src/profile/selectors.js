import * as R from 'ramda'
import { derive } from 'framework-x'
import { getUser } from '../user/selectors'

export const getProfileForm = R.path(['profile'])
export const getProfileFormLoading = R.path(['profile', 'isLoading'])
export const getProfileFormErrors = R.path(['profile', 'errors'])

export const getProfileUser = R.pathOr({},['profile'])
export const isViewingSelf = derive([getProfileUser, getUser], (user1, user2) =>
  R.path(['username'], user1) === R.path(['username'], user2))
