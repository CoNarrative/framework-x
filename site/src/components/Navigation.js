import React from 'react'
import { Link } from 'gatsby'
import styled from '@emotion/styled'
import * as theme from '../theme'
import Logo from '../assets/icons/logo.svg'
import MulletMan from '../images/mullet-man1.png'
import Github from '../assets/icons/github.svg'

const Container = styled.div({
  display: 'flex',
  fontWeight: 500,
  alignItems: 'center',

  '& > :not(:last-child)': {
    marginRight: 40,
  }
})

export const Navigation = ({ siteTitle }) => (
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
    <Link to={'/'} style={{ display: 'flex', alignItems: 'center' }}>
      <img style={{ height: 38 }} src={MulletMan} alt={'logo'} />
      <img style={{ height: 16 }} src={Logo} alt={'logo'} />
    </Link>
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
        to="/api"
        style={{
          color: theme.darkGrey,
          textDecoration: `none`,
        }}
      >
        Documentation
      </Link>
      <Link
        to="/learn"
        style={{
          color: theme.darkGrey,
          textDecoration: `none`,
        }}
      >
        Learn
      </Link>
      <a href={'http://github.com/CoNarrative/framework-x'}
         target={'_blank'}>
        <img src={Github} />
      </a>
    </Container>
  </div>
)
