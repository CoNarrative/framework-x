import React from 'react'
import {Link} from 'gatsby'
import styled from '@emotion/styled'
import * as theme from '../theme'

const Container = styled.div({
  color: theme.lightGrey,
  backgroundColor: theme.black,
  width: 320,
  position: 'sticky',
  top: 0,
  paddingLeft: 48,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column'
})

const Topic = ({active, topic, subtopics}) => (
  <div css={{marginBottom: '1.2rem'}}>
    <h3 css={{color: active ? theme.lightTeal : 'white', marginBottom: '0.8rem'}}>
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
    <div>Search bar</div>
    <div css={{marginTop: 40, flexShrink: 0, flexGrow: 1,}}>
      <Topic active topic={'Topic #1'} subtopics={['Subtopic 1', 'Subtopic 2', 'Subtopic 3']}/>
      <Topic topic={'Topic #2'}/>
      <Topic topic={'Topic #3'} subtopics={['Subtopic 1', 'Subtopic 2']}/>
    </div>
  </Container>
)
