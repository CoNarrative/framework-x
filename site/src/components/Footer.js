import { OutboundLink } from 'gatsby-plugin-google-analytics'
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

const Navlink = ({children, to, href}) => (
  <React.Fragment>
    {href
     ? <OutboundLink
       href={href}
       target={'_blank'}
       css={{
         fontSize: '1rem',
         fontWeight: 600,
         textDecoration: 'none',
         color: theme.black,
         marginLeft: 12,
         marginBottom: 12,
         letterSpacing: '-0.014rem',
       }}>{children}</OutboundLink>
     : <Link to={to} css={{
        fontSize: '1rem',
        fontWeight: 600,
        textDecoration: 'none',
        color: theme.black,
        marginLeft: 12,
        marginBottom: 12,
        letterSpacing: '-0.014rem',
      }}>{children}</Link>}
  </React.Fragment>
)

export const Footer = ({floating}) => (
  <Banner rootCss={{
    borderTop: '1px solid ' + theme.black,
    position: floating ? 'absolute' : 'relative',
    left: 0,
    right: 0,
    [whenTablet]: {paddingBottom: 0}
  }} wrapCss={{
    [whenTablet]: {flexDirection: 'column-reverse', alignItems: 'center'},
    [whenMobile]: {alignItems: 'flex-start', paddingLeft: 40, paddingRight: 24},
  }}>
    <div css={{[whenTablet]: {marginTop: 48, alignSelf: 'flex-start', position: 'absolute', left: 32, bottom: 32}}}>
      {/*<div css={{fontFamily: '', color: theme.darkGrey, fontSize: '1rem', marginBottom: 8,}}>Built with...</div>*/}
      <div css={{fontFamily: 'Basier Square Mono', fontSize: '1rem'}}>@2019 CoNarrative Inc.</div>
    </div>
    <div css={{display: 'flex', [whenTablet]: {paddingBottom: 144,}, [whenMobile]: {flexDirection: 'column',}}}>
      <div css={{
        display: 'flex',
        flexDirection: 'column',
        marginRight: 120,
        '& > :last-child': {marginBottom: 0},
        [whenMobile]: {marginRight: 0, marginBottom: 80}
      }}>
        <Header>Resources</Header>
        <Navlink href={'https://github.com/CoNarrative/framework-x/'}>Github</Navlink>
        <Navlink to={'/api'}>Documentation</Navlink>
        <Navlink to={'/learn'}>Learn</Navlink>
        {/*<Navlink to={'/examples'}>Examples</Navlink>*/}
      </div>
      <div css={{display: 'flex', flexDirection: 'column', '& > :last-child': {marginBottom: 0}}}>
        <Header>Connect with us!</Header>
        <Navlink href={'https://twitter.com/framework_x'}>Twitter</Navlink>
        <Navlink href={'https://www.reddit.com/r/framework_x/'}>reddit</Navlink>
        <Navlink href={'https://github.com/CoNarrative/framework-x/issues'}>Github issues</Navlink>
      </div>
      <div></div>
    </div>
  </Banner>
)
