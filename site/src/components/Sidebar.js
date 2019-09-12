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
import root from "../../.cache/root";

const Container = styled.div( props => ({
  color: theme.darkGrey,
  width: 320,
  position: 'sticky',
  top: 0,
  paddingLeft: 48,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  paddingTop: 64,
  marginRight: 96,
  zIndex: 10,

  [whenSmallScreen]: {
    paddingLeft: 20,
    marginRight: 40,
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

export class Sidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownExpanded: false
    }
  }

  expandDropdown = () => (
    this.setState({dropdownExpanded: !this.state.dropdownExpanded})
  )

  render() {
    const {rootCss} = this.props
    return (
      <Container rootCss={rootCss}>
        {/*<Search/>*/}
        <div css={{flexShrink: 0, flexGrow: 1, paddingLeft: 20, [whenTablet]: {display: 'none'}}}>
          <Topic active topic={'Topic #1'} subtopics={['Subtopic 1', 'Subtopic 2', 'Subtopic 3']}/>
          <Topic topic={'Topic #2'}/>
          <Topic topic={'Topic #3'} subtopics={['Subtopic 1', 'Subtopic 2']}/>
        </div>
        <DimensionalBox handleHeight={true}
                        rootCss={{display: 'none', [whenTablet]: {display: 'flex'}, [whenMobile]: {display: 'none'}}}>
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
              }}>
              <Topic mobile active topic={'Topic #1'}
                     rootCss={{marginBottom: 'unset', paddingTop: 12, paddingBottom: 12,}}/>
              <img css={{height: 8,}} src={Chevron}/>
            </div>
            <div css={{
              borderTop: '1px solid ' + theme.black,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 20,
              display: this.state.dropdownExpanded ? 'block' : 'none'
            }}>
              <Topic topic={'Topic #1'} subtopics={['Subtopic 1', 'Subtopic 2', 'Subtopic 3']}/>
              <Topic topic={'Topic #2'}/>
              <Topic topic={'Topic #3'} subtopics={['Subtopic 1', 'Subtopic 2']}/>
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
              backgroundColor: 'white',
            }}>
            <Topic mobile active topic={'Topic #1'}
                   rootCss={{marginBottom: 'unset', paddingTop: 12, paddingBottom: 12,}}/>
            <img css={{height: 8,}} src={Chevron}/>
          </div>
          <div css={{
            borderBottom: '1px solid ' + theme.black,
            backgroundColor: 'white',
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 20,
            display: this.state.dropdownExpanded ? 'block' : 'none',
          }}>
            <Topic topic={'Topic #1'} subtopics={['Subtopic 1', 'Subtopic 2', 'Subtopic 3']}/>
            <Topic topic={'Topic #2'}/>
            <Topic topic={'Topic #3'} subtopics={['Subtopic 1', 'Subtopic 2']}/>
          </div>
        </div>
      </Container>
    )
  }
}
