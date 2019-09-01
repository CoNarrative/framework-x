import React from 'react'
import { Link } from 'gatsby'
import { jsx } from '@emotion/core'
import styled from '@emotion/styled'
import Layout from '../components/layout'
import MulletManFluid from '../components/image'
import SEO from '../components/seo'
import { DimensionalBox } from '../components/DimensionalBox'


const MulletManMain = () =>
  <div css={{ width: '33%' }}>
    <MulletManFluid />
  </div>

const MainContent = ({ starCount, downloadCount }) =>
  <div>
    <h1>Reasonable global state</h1>
    <div css={{marginBottom:'1.45rem'}}>
      foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo
      bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar baz foo bar
      baz foo bar baz
    </div>

    <div css={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
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
          {/*<span></span>*/}
        </div>
      </DimensionalBox>
    </div>
  </div>

const IndexPage = ({ pageContext: { starCount, downloadCount } }) => {
  return (
    <Layout>
      <SEO title="framework-x: Reasonable global state" />

      <div css={{ display: 'flex', alignItems: 'center', width: '100%' }}>
        <MulletManMain />
        <MainContent {...{ starCount, downloadCount }} />
      </div>

    </Layout>
  )
}

export default IndexPage
