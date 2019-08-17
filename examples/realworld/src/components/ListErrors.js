import React from 'react'
import * as R from 'ramda'

export const ListErrors = ({ errors }) =>
  <ul className="error-messages">
    {Object.entries(errors).map(([k, v]) =>
      <li key={k}>
        {k} {R.head(v)}
      </li>
    )}
  </ul>
