import React from 'react'
import { FormInput } from '../components/FormInput'
import { changeAuthKey } from './events'
import {
  getEmail,
  getIsAuthLoading,
  getAuthErrors,
  getPassword,
} from './selectors'
import { evt } from '../eventTypes'
import { routeIds } from '../routes'
import { Link } from '../components/Link'
import { ListErrors } from '../components/ListErrors'
import { dispatch } from '../store'
import { component, createSub } from 'framework-x'

const requestLogin = ({ email, password }) =>
  dispatch(evt.USER_REQUESTS_LOGIN, { email, password })

const inputs = ({ email, password, }) => [{
  type: 'email',
  placeholder: 'Email',
  value: email,
  onKeyDown: e => e.which === 13 && requestLogin({ email, password }),
  onChange: changeAuthKey('email')
}, {
  type: 'password',
  placeholder: 'Password',
  value: password,
  onKeyDown: e => e.which === 13 && requestLogin({ email, password }),
  onChange: changeAuthKey('password')
}]

export const Login = component('Login', createSub({
    getEmail, getPassword, isRequestInFlight: getIsAuthLoading, errors: getAuthErrors
  }), ({ email, password, isRequestInFlight, errors }) =>
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

            {errors && <ListErrors errors={errors} />}

            <form>
              <fieldset>
                {inputs({ email, password }).map((props, i) =>
                  <FormInput key={i}{...props} />)}

                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="button"
                  onClick={() => requestLogin({ email, password })}
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

