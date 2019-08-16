import React from 'react'
import {
  getEmail,
  getIsAuthLoading,
  getLoginErrors,
  getPassword,
} from './selectors'
import { evt } from '../eventTypes'
import { routeIds } from '../routes'
import { Link } from '../components/Link'
import ListErrors from '../components/ListErrors'
import { dispatch } from '../store'
import { component, createSub } from 'framework-x'


export const Login = component('Login', createSub({
    getEmail,
    getPassword,
    getIsAuthLoading,
    getLoginErrors
  }), ({ email, password, isAuthLoading: isRequestInFlight, loginErrors: errors }) => {
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to={[routeIds.REGISTER]}>
                  Need an account?
                </Link>
              </p>

              <ListErrors errors={errors} />

              <form onSubmit={() => dispatch(evt.USER_REQUESTS_LOGIN, { email, password })}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={
                        e => dispatch(evt.SET_KV, ['auth', 'email'], e.target.value)} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={
                        e => dispatch(evt.SET_KV, ['auth', 'password'], e.target.value)} />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={isRequestInFlight}>
                    Sign in
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
    )
  }
)

