import React from 'react'
import { evt } from '../eventTypes'
import { component, createSub } from 'framework-x'
import { setKV } from '../generalEvents'
import {
  getProfileForm,
  getProfileFormErrors,
  getProfileFormLoading
} from '../profile/selectors'
import { FormInput } from './FormInput'
import { ListErrors } from './ListErrors'
import { dispatch } from '../store'

const setProfileField = k => e => setKV(['profile', k], e.target.value)

const inputs = ({ image, username, bio, email, password }) => [
  { name: 'email', className: 'form-control', placeholder: 'URL of profile picture', value: image, },
  { name: 'username', placeholder: 'Username', value: username, },
  { name: 'bio', type: 'textarea', rows: 8, placeholder: 'Short bio about you', value: bio, },
  { name: 'email', type: 'email', placeholder: 'Email', value: email, },
  { name: 'password', type: 'password', placeholder: 'New Password', value: password, }
]

const SettingsForm = component('SettingsForm',
  createSub({ requestInFlight: getProfileFormLoading, profile: getProfileForm }),
  ({ profile, requestInFlight }) =>
    <form>
      <fieldset>
        {profile && inputs(profile).map((props, i) =>
          <FormInput key={i} {...props} onChange={setProfileField(props.name)} />)}
        <button type="button" className="btn btn-lg btn-primary pull-xs-right"
                onClick={() => dispatch(evt.USER_REQUESTS_SAVE_PROFILE)}
                disabled={requestInFlight}>
          Update Settings
        </button>
      </fieldset>
    </form>
)

export const Settings = component('Settings', createSub({ errors: getProfileFormErrors }), ({ errors }) =>
  <div className="settings-page">
    <div className="container page">
      <div className="row">
        <div className="col-md-6 offset-md-3 col-xs-12">
          <h1 className="text-xs-center">Your Settings</h1>

          {errors && <ListErrors errors={errors} />}

          <SettingsForm />

          <hr />

          <button className="btn btn-outline-danger"
                  onClick={() => dispatch(evt.USER_REQUESTS_LOGOUT)}>
            Or click here to logout.
          </button>

        </div>
      </div>
    </div>
  </div>
)
