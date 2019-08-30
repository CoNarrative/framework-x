import React from "react"
import {Link} from "gatsby"
import PropTypes from "prop-types"
import {jsx} from '@emotion/core'
import styled from '@emotion/styled'
import * as theme from '../theme'
import Logo from '../assets/icons/logo.svg'
import Github from '../assets/icons/github.svg'

const Container = styled.div({
  display: 'flex',
  fontWeight: 500,
  alignItems: 'center',

  '& > :not(:last-child)': {
    marginRight: 40,
  }
})

export const Navigation = ({siteTitle}) => (
  <div
    css={{
      background: `white`,
      marginBottom: `1.45rem`,
      boxShadow: '0 4px 16px 0 rgba(20,27,46,0.07)',
      height: 64,
      display: 'flex',
      alignItems: 'center',
      fontSize: 15,
      justifyContent: 'space-between',
      padding: '0 64px',
    }}
  >
    <img src={Logo}/>
    <Container>
      <Link
        to="/"
        style={{
          color: theme.darkGrey,
          textDecoration: `none`,
        }}
      >
        Features
      </Link>
      <Link
        to="/"
        style={{
          color: theme.darkGrey,
          textDecoration: `none`,
        }}
      >
        Documentation
      </Link>
      <Link
        to="/"
        style={{
          color: theme.darkGrey,
          textDecoration: `none`,
        }}
      >
        Learn
      </Link>
      <Link to={'/'} >
        <img src={Github}/>
      </Link>
    </Container>
  </div>
)
