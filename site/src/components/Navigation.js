import { OutboundLink } from 'gatsby-plugin-google-analytics'
import React from 'react'
import {Link} from 'gatsby'
import styled from '@emotion/styled'
import * as theme from '../theme'
import Logo from '../assets/icons/framework-x-complete.svg'
import MulletMan from '../images/mullet-man1.png'
import Github from '../assets/icons/github.svg'
import {whenMobile} from "../theme";
import HamburgerMenuIcon from '../assets/icons/hamburger-menu.svg'

const Container = styled.div( props => ({
  display: 'flex',
  fontWeight: 500,
  alignItems: 'center',

  '& > :not(:last-child)': {
    marginRight: 40,
  },

  [whenMobile]: {
    display: props.expanded ? 'flex' : 'none',
    marginTop: 28,
    justifyContent: 'center',

    '& > :not(:last-child)': {
      marginRight: 20,
    },
  }
}))

const Navlink = ({to, label, rootCss}) => (
  <Link css={{color: theme.darkGrey, textDecoration: `none`, ...rootCss,}} to={to} >{label}</Link>
)

export class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  expandHamburgerMenu = () => {
    let isExpanded = !this.state.expanded
    this.setState({expanded: isExpanded})
    this.props.isHamburgerMenuExpanded(isExpanded)
  }

  render() {
    const {siteTitle, } = this.props
    return (
      <div
        css={{
          background: `white`,
          boxShadow: '0 4px 16px 0 rgba(20,27,46,0.07)',
          height: this.state.expanded ? 112 : 64,
          display: 'flex',
          alignItems: 'center',
          fontSize: 15,
          padding: '0 64px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,

          [whenMobile]: {
            flexDirection: 'column',
            marginBottom: this.state.expanded ? 0 : 48,
            padding: '0 28px',
            paddingTop: 16,
            alignItems: 'unset',
          }
        }}
      >
        <div css={{ display: 'flex', justifyContent: 'space-between', width: '100%'}}>
          <div onClick={this.expandHamburgerMenu}
               css={{display: 'none', cursor: 'pointer', [whenMobile]: {display: 'flex', alignItems: 'center'}}}>
            <img src={HamburgerMenuIcon}/>
          </div>
          <Link to={'/'} css={{display: 'flex', alignItems: 'center', [whenMobile]:{position: 'relative', left: -4}}}>
            {/*<img style={{height: 38}} src={MulletMan} alt={'logo'}/>*/}
            <img style={{height: 36}} src={Logo} alt={'logo'}/>
          </Link>
          <div css={{display: 'none', [whenMobile]: {display: 'block'}}}>
            <OutboundLink href={'http://github.com/CoNarrative/framework-x'}
               target={'_blank'}>
              <img style={{width: 28}} src={Github}/>
            </OutboundLink>
          </div>
        </div>
        <Container expanded={this.state.expanded}>
          <Navlink to={'/'} label={'Features'}/>
          <Navlink to={'/api'} label={'Documentation'}/>
          <Navlink to={'/learn'} rootCss={{[whenMobile]: {marginRight: '0 !important'}}} label={'Learn'}/>
          <OutboundLink
            css={{ [whenMobile]: { display: 'none' } }}
            href={'http://github.com/CoNarrative/framework-x'}
            target={'_blank'}>
            <img src={Github} />
          </OutboundLink>
        </Container>
      </div>
    )
  }
}
