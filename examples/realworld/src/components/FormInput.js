import React from 'react'

export const FormInput = ({ type = 'text', placeholder, className, value = '', rows, onChange, onKeyDown }) =>
  <fieldset className="form-group">
    {type === 'textarea'
     ? <textarea className={className || 'form-control form-control-lg'}
                 {...{ placeholder, value, rows, onChange, onKeyDown }} />
     : <input className={className || 'form-control form-control-lg'}
              {...{ type, placeholder, value, onChange, onKeyDown }}
     />}
  </fieldset>
