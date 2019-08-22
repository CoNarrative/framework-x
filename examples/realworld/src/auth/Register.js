import React from 'react'
import { component, createSub } from 'framework-x'
import { FormInput } from '../components/FormInput'
import { evt } from '../eventTypes'
import { dispatch } from '../store'
import { routeIds } from '../routes'
import { Link } from '../components/Link'
import { ListErrors } from '../components/ListErrors'
import { changeAuthKey } from './events'
import {
  getAuthErrors,
  getEmail,
  getIsAuthLoading,
  getPassword,
  getUsername
} from './selectors'


const requestRegister = ({ username, email, password }) =>
  dispatch(evt.USER_REQUESTS_REGISTER, { username, email, password })

const inputs = ({ username, email, password, }) => [{
  placeholder: 'Username',
  value: username,
  onKeyDown: e => e.which === 13 && requestRegister({ username, email, password }),
  onChange: changeAuthKey('username')
}, {
  type: 'email',
  placeholder: 'Email',
  value: email,
  onKeyDown: e => e.which === 13 && requestRegister({ username, email, password }),
  onChange: changeAuthKey('email')
}, {
  type: 'password',
  placeholder: 'Password',
  value: password,
  onKeyDown: e => e.which === 13 && requestRegister({ username, email, password }),
  onChange: changeAuthKey('password')
}]

export const Register = component('Register', createSub({
    getUsername, getEmail, getPassword, getIsAuthLoading, getAuthErrors
  }), ({ username, email, password, isAuthLoading, authErrors }) =>
    <div className="auth-page">
      <div className="container page">
        <div className="row">

          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign Up</h1>
            <p className="text-xs-center">
              <Link to={[routeIds.LOGIN]}>Have an account?</Link>
            </p>

            {authErrors && <ListErrors errors={authErrors} />}

            <form>
              <fieldset>
                {inputs({ username, email, password }).map((props, i) =>
                  <FormInput key={i}{...props} />)}

                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="button"
                  disabled={isAuthLoading}
                  onClick={() => requestRegister({ username, email, password })}>
                  Sign up
                </button>

              </fieldset>
            </form>
          </div>

        </div>
      </div>
    </div>
)
