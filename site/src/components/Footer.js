import React from 'react'
import {Link} from 'gatsby'
import styled from '@emotion/styled'
import * as theme from '../theme'
import {Banner} from "../templates";
import {whenTablet} from "../theme";
import {whenMobile} from "../theme";

const Wrapper = styled.div({
  height: 302,
  display: 'flex',
  justifyContent: 'center',
  borderTop: '1px solid ' + theme.black,
})

const Container = styled.div({
  width: '100%',
  maxWidth: 1280,
  display: 'flex',
  paddingTop: 48,
})

const Header = styled.div({
  fontSize: '1.4rem',
  fontFamily: 'Animosa',
  fontWeight: 800,
  letterSpacing: '0.08rem',
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
    letterSpacing: '-0.014rem',
  }}>{children}</Link>
)

export const Footer = () => (
  <Banner rootCss={{ borderTop: '1px solid ' + theme.black, [whenTablet]: {paddingBottom: 0}}} wrapCss={{ [whenMobile]: {alignItems: 'flex-start'}, [whenTablet]: {flexDirection: 'column-reverse', alignItems: 'center'}}}>
    <div css={{ [whenTablet]: {marginTop: 48, alignSelf: 'flex-start', position: 'absolute', left: 32, bottom: 32 }}}>
      <div css={{fontFamily: '', color: theme.darkGrey, fontSize: '1rem', marginBottom: 8,}}>Built with...</div>
      <div css={{fontFamily: 'Basier Square Mono', fontSize: '1rem'}}>@2019 CoNarrative Inc.</div>
    </div>
    <div css={{display: 'flex', [whenTablet]: {paddingBottom: 144,}, [whenMobile]:{flexDirection: 'column',}}}>
      <div css={{display: 'flex', flexDirection: 'column', marginRight: 120, '& > :last-child': {marginBottom: 0}, [whenMobile]: {marginRight: 0, marginBottom: 80}}}>
        <Header>Resources</Header>
        <Navlink>Github</Navlink>
        <Navlink>Documentation</Navlink>
        <Navlink>Examples</Navlink>
        <Navlink>Community</Navlink>
      </div>
      <div css={{display: 'flex', flexDirection: 'column', '& > :last-child': {marginBottom: 0}}}>
        <Header>Connect with us!</Header>
        <Navlink>Twitter</Navlink>
        <Navlink>reddit</Navlink>
        <Navlink>Github issues</Navlink>
        <Navlink>E-mail</Navlink>
      </div>
      <div></div>
    </div>
  </Banner>
)
