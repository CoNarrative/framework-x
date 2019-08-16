import * as R from 'ramda'


export const getToken = () => localStorage.getItem('jwt')
export const isLoggedIn = () => !!getToken()
export const getUsername = R.path(['auth','username'])
export const getEmail = R.path(['auth','email'])
export const getPassword = R.path(['auth','password'])
export const getIsAuthLoading = R.path(['auth','isLoading'])
export const getLoginErrors = R.path(['auth','errors'])
