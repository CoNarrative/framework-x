import React from 'react'
import { evt } from '../eventTypes'
import { dispatch } from '../store'

export const Link = ({ to, href = "",className, onClick, children }) =>
  <a {...{className, href}} onClick={e => {
    e.preventDefault()
    if (onClick) return onClick(e)
    const [routeId, params = {}, query] = to
    dispatch(evt.NAV_TO, [routeId, params, query])
  }}>{children}</a>

export const NavLink = ({ to, onClick, isActive, className = 'nav-link', children }) =>
  <li className="nav-item"><Link  {...{ to, onClick, isActive, className, children }} />
  </li>
