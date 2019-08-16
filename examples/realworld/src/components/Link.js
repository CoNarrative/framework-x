import React from 'react'
import { evt } from '../eventTypes'
import { dispatch } from '../store'

export const Link = ({ to, className, children }) =>
  <a className={className} onClick={e => {
    const [routeId, params = {}, query] = to
    e.preventDefault()
    dispatch(evt.NAV_TO, [routeId, params, query])
  }}>
    {children}
  </a>
