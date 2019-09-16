import React from 'react'
import {Link} from 'gatsby'
import styled from '@emotion/styled'
import * as theme from '../theme'
import Logo from '../assets/icons/new-logo.svg'
import MulletMan from '../images/mullet-man1.png'
import Github from '../assets/icons/github.svg'
import {whenMobile} from "../theme";
import HamburgerMenuIcon from '../assets/icons/hamburger-menu.svg'

const Wrapper = styled.div({
  height: 302,
  display: 'flex',
  justifyContent: 'center',
  borderTop: '1px solid ' + theme.black,
})

const Container = styled.div({
  width: '100%',
  maxWidth: 960,
  display: 'flex',
  paddingTop: 48,
  '& > :not(:last-child)': {}
})

const Header = styled.div({
  fontSize: '1.4rem',
  fontFamily: 'Animosa',
  fontWeight: 800,
  letterSpacing: '0.1rem',
  marginBottom: 16,
})

const Navlink = ({children, to}) => (
  <Link to={to} css={{
    fontSize: '1rem',
    fontWeight: 600,
    textDecoration: 'none',
    color: theme.black,
    marginLeft: 12,
    marginBottom: 12,
  }}>{children}</Link>
)

export const Footer = () => (
  <Wrapper>
    <Container>
      <div css={{ marginRight: 180, }}>
        <div css={{fontFamily: '', color: theme.darkGrey, fontSize: '1rem', marginBottom: 4,}}>Built with...</div>
        <div css={{fontFamily: 'Basier Square Mono', fontSize: '1rem'}}>@2019 CoNarrative Inc.</div>
      </div>
      <div css={{ display: 'flex', }}>
        <div css={{display: 'flex', flexDirection: 'column', marginRight: 120, '& > :last-child': {marginBottom: 0}}}>
          <Header>Resources</Header>
          <Navlink>Github</Navlink>
          <Navlink>Documentation</Navlink>
          <Navlink>Examples</Navlink>
          <Navlink>Community</Navlink>
        </div>
        <div css={{display: 'flex', flexDirection: 'column', '& > :last-child': {marginBottom: 0}}}>
          <Header>Connect with us!</Header>
          <Navlink>Github issues</Navlink>
          <Navlink>E-mail</Navlink>
        </div>
        <div></div>
      </div>
    </Container>
  </Wrapper>
)
