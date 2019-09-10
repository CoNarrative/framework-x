import React from 'react'
import {Link} from 'gatsby'
import styled from '@emotion/styled'
import * as theme from '../theme'
import {DimensionalBox} from "./DimensionalBox";
import SearchIcon from '../assets/icons/search.svg'

const Container = styled.div({
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
})

const Search = () => (
  <DimensionalBox rootCss={{alignItems: 'center',}} width={280}>
    <div css={{ display: 'flex', alignItems: 'center', paddingLeft: 10,}}>
      <img css={{ paddingBottom: 4, }} src={SearchIcon}/>
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

const Topic = ({active, topic, subtopics}) => (
  <div css={{marginBottom: '1.2rem'}}>
    <h3 css={{color: active ? theme.lightTeal : theme.black, marginBottom: '0.8rem'}}>
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
export const Sidebar = () => (
  <Container>
    <Search/>
    <div css={{marginTop: 40, flexShrink: 0, flexGrow: 1, paddingLeft: 20,}}>
      <Topic active topic={'Topic #1'} subtopics={['Subtopic 1', 'Subtopic 2', 'Subtopic 3']}/>
      <Topic topic={'Topic #2'}/>
      <Topic topic={'Topic #3'} subtopics={['Subtopic 1', 'Subtopic 2']}/>
    </div>
  </Container>
)
