import * as R from 'ramda'


export const getToken = R.path(['token'])
export const getUsername = R.path(['auth', 'username'])
export const getEmail = R.path(['auth', 'email'])
export const getPassword = R.path(['auth', 'password'])
export const getIsAuthLoading = R.path(['auth', 'isLoading'])
export const getAuthErrors = R.path(['auth', 'errors'])
