import React from 'react'
import {Link} from 'gatsby'
import styled from '@emotion/styled'
import * as theme from '../theme'
import {DimensionalBox} from "./DimensionalBox";
import SearchIcon from '../assets/icons/search.svg'
import {whenSmallScreen} from "../theme";
import {whenTablet} from "../theme";
import Chevron from '../assets/icons/chevron.svg'
import {whenMobile} from "../theme";

const Container = styled.div(props => ({
  color: theme.darkGrey,
  width: 320,
  position: 'sticky',
  top: 0,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 64,
  marginRight: 96,
  zIndex: 10,

  [whenSmallScreen]: {
    marginRight: 48,
  },

  [whenTablet]: {
    position: 'fixed',
    width: 284,
    paddingTop: 0,
    top: 88,
    right: 32,
    marginRight: 0,
  },
  ...props.rootCss,
}))

const Search = () => (
  <DimensionalBox rootCss={{alignItems: 'center',}} width={280}>
    <div css={{display: 'flex', alignItems: 'center', paddingLeft: 10,}}>
      <img css={{paddingBottom: 4,}} src={SearchIcon}/>
      <input
        css={{
          marginLeft: 1,
          height: 32,
          marginBottom: 5,
          padding: 0,
          paddingTop: 6,
          paddingLeft: 10,
          width: 236,
          backgroundColor: 'rgba(255,255,255,0)',
          border: 'none',
          outline: 'none',
          fontFamily: 'Basier Square Mono',

        }}
        placeholder={'Search documentation...'}
      />
    </div>
  </DimensionalBox>
)

const Content = styled.div(props => ({
  flexShrink: 0,
  flexGrow: 1,
  paddingLeft: 20,

  '& ul': {
    listStyleType: 'none',
    paddingLeft: 0,
  },

  '& li': {
    listStyleType: 'none',
  },

  // First Header Container
  '& > ul > li': {
    marginBottom: '0.8rem',
  },

  // First Header Text
  '& > ul > li > p > a': {
    color: props.active ? theme.darkTeal : theme.black,
    marginBottom: props.mobile ? 0 : '0.8rem',
    marginTop: 0,
    textDecoration: 'none',
    fontSize: '1.2rem',
    fontWeight: 600,
    fontFamily: 'Animosa',
  },

  // Nested list items container
  '& > ul > li > ul > li': {
    marginBottom: '0.8rem',
    paddingLeft: '1.2rem',
    letterSpacing: '-0.03rem',
  },

  // Nested list items last container
  '& > ul > li > ul > li:last-child': {
    marginBottom: '1.6rem',
  },

  // Nested list items text
  '& > ul > li > ul > li > a': {
    fontFamily: 'Basier Square Mono',
    fontSize: '0.8rem',
  },

  [whenTablet]: {
    '& > ul > li > p > a': {
      fontSize: '1rem',
    },
  },

  ...props.rootCss,
}))

const Topic = ({active, topic, subtopics, rootCss, mobile}) => (
  <div css={{marginBottom: '1.2rem', ...rootCss}}>
    <h3 css={{
      color: active ? theme.darkTeal : theme.black,
      marginBottom: mobile ? 0 : '0.8rem',
      marginTop: 0,
    }}>
      {topic}
    </h3>
    <div css={{paddingLeft: '0.9rem'}}>
      {subtopics && subtopics.map((subtopic) => {
        return (
          <h5 css={{marginTop: 0, marginBottom: '0.8rem'}}>{subtopic}</h5>
        )
      })}
    </div>
  </div>
)
const DropdownItems = ({items,onClick})=>{
  return  (
    <Content>
        {items && items.map(({id,innerHTML},i)=>{
        return <li key={i}
                   onClick={()=>onClick(id)}
                   dangerouslySetInnerHTML={{__html: innerHTML}} />
      })}
    </Content>
  )
}
export class TableOfContents extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownExpanded: false,
    }
  }
  expandDropdown = () => (
    this.setState({dropdownExpanded: !this.state.dropdownExpanded})
  )
  onDropdownItemClick=(id)=>{
    const link = document.getElementById(id).getElementsByTagName('a')[0]
    link.click()
    this.setState({ dropdownExpanded: false })
  }

  render() {
    const {rootCss,tableOfContents } = this.props

    return (
      <Container rootCss={rootCss}>
        {/*<Search/>*/}
        <DropdownItems
          items={this.props.tableOfContents}
          onClick={this.onDropdownItemClick}
        />
        <DimensionalBox handleHeight={true}
                        rootCss={{
                          display: 'none',
                          [whenTablet]: {display: 'flex', zIndex: '10',},
                          [whenMobile]: {display: 'none'}
                        }}>
          <div css={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}>
            <div
              onClick={this.expandDropdown}
              css={{
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 20,
                paddingRight: 20,
                justifyContent: 'space-between',
                width: '100%',
                cursor: 'pointer',
                zIndex: '101',
              }}>
              <Topic mobile topic={'Table of Contents'}
                     rootCss={{marginBottom: 'unset', paddingTop: 12, paddingBottom: 12,}}/>
              <img css={{height: 8,}} src={Chevron}/>
            </div>
            <div css={{
              borderTop: '1px solid ' + theme.black,
              boxShadow: '0 4px 16px 0 rgba(20,27,46,0.07)',
              display: this.state.dropdownExpanded ? 'block' : 'none'
            }}>
              <DropdownItems
                items={this.props.tableOfContents}
                onClick={this.onDropdownItemClick}
              />
            </div>
          </div>
        </DimensionalBox>
        <div css={{display: 'none', flexDirection: 'column', [whenMobile]: {display: 'flex'}}}>
          <div
            onClick={this.expandDropdown}
            css={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 20,
              paddingRight: 20,
              justifyContent: 'space-between',
              width: '100%',
              cursor: 'pointer',
              borderTop: '1px solid ' + theme.black,
              borderBottom: '1px solid ' + theme.black,
              height: 48,
              zIndex: 11,
              backgroundColor: 'white',
              boxShadow: '0 4px 16px 0 rgba(20,27,46,0.07)',
            }}>
            <Topic mobile topic={'Table of Contents'}
                   rootCss={{marginBottom: 'unset', paddingTop: 12, paddingBottom: 12,}}/>
            <img css={{height: 8,}} src={Chevron}/>
          </div>
          <div css={{
            borderBottom: '1px solid ' + theme.black,
            backgroundColor: 'white',
            display: this.state.dropdownExpanded ? 'block' : 'none',
            boxShadow: '0 4px 16px 0 rgba(20,27,46,0.07)',
            zIndex: 12,
          }}>
            <DropdownItems
              items={this.props.tableOfContents}
              onClick={this.onDropdownItemClick}
            />
          </div>
        </div>
      </Container>
    )
  }
}
