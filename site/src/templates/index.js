import React from 'react'
import { Link } from 'gatsby'
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import Layout from '../components/layout'
import Image from '../components/image'
import SEO from '../components/seo'
import { DimensionalBox } from '../components/DimensionalBox'

const Header = styled.h1`
  padding: 100px
`

const IndexPage = ({ pageContext: { starCount, downloadCount } }) => {
  return (
    <Layout>
      <SEO title="framework-x: Reasonable global state" />
      <Header>Reasonable global state</Header>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
        <Image />
        <DimensionalBox rootCss={{ alignItems: 'center', }} width={520} height={38}>
          <div css={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            paddingBottom: 6,
            '& > :not(:last-child)': { marginRight: 64 }
          }}>
            <span>License: MIT</span>
            <a href={'https://github.com/CoNarrative/framework-x'}
               target={'_blank'}
               style={{ color: 'inherit', textDecoration: 'inherit' }}>
              +{starCount} stars
            </a>
            <a href={'https://www.npmjs.com/package/framework-x'}
               target={'_blank'}
               style={{ color: 'inherit', textDecoration: 'inherit' }}>
              +{downloadCount} downloads
            </a>
            <span></span>
          </div>
        </DimensionalBox>
      </div>
      <Link to="/learn">Learn</Link>
      <Link to="/api">API</Link>
    </Layout>
  )
}

export default IndexPage
