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
//       Framework-X is a Javascript framework that enables developers to define cause and effect relationships.
//       Framework-X is a Javascript framework that gives developers explicit control over cause and effect in their programs.
//       Framework-X is a Javascript framework that requires writing less code, gives developers explicit control over cause and effect in their programs.
//       receives user-defined events and executes whatever effects you've defined for them.
//
//       Framework-X is a Javascript framework that encourages simple and explicit definition of cause and effect.

// Applications map events to descriptions of what should happen next, forming a definition  of what each event means -- a state change, an
//       Applications form definitions of what events mean by mapping events to descriptions of their outcomes -- a state change, an
//       Applications form definitions of what events mean by mapping events to descriptions of all effects they entail -- a state change, an
//       asynchronous API call, the invocation of a custom function, or another event.
//       asynchronous API call, the invocation of a custom function, another event, or a combination.
//       The framework executes each instruction whenever the event is dispatched.
//
//       receives user-defined events and executes whatever effects you've defined for them.
//
//
//       framework-x is a reactive, event-based front-end framework for
//       implementing deterministic state machines in Javascript. It shares much
//       of its API and design with Clojurescript's
//       <code>re-frame</code>(https://github.com/Day8/re-frame), the
//       [most expressive front-end framework to date](https://www.freecodecamp.org/news/a-realworld-comparison-of-front-end-frameworks-with-benchmarks-2019-update-4be0d3c78075/)
//       . It has things in common with Redux, but differs in ways that have
//       far-reaching consequences for simplicity, mental overhead, and
//       productivity.
const highlightStyle = {
  padding: '2px 0px 4px 0',
  backgroundImage: 'linear-gradient(transparent 0%, transparent calc(50% - 8px), rgba(112, 224, 163, 1) calc(50% - 8px), rgba(112, 224, 163, 1) 100% )',
  backgroundPosition: '0 120%',
  backgroundSize: '100% 200%'
}

const Highlight = ({ children }) => <span css={highlightStyle}>{children}</span>

const MainContent = ({ starCount, downloadCount }) =>
  <div>
    <h1>
      Reasonable <Highlight>global state.</Highlight>
    </h1>
    <div css={{ marginBottom: '1.45rem' }}>
      Framework-X is a Javascript framework that processes simple definitions of cause and
      effect.
      Applications define what their events mean by mapping them to descriptions of the
      effects they entail -- a state change, an
      asynchronous API call, the invocation of a custom function, or another event.
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
