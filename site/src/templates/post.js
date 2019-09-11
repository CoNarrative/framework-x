import React from 'react'
import {graphql} from 'gatsby'
import RehypeReact from 'rehype-react'
import Layout from '../components/layout'
import {Highlight} from '../components/TextBackgroundHighlight'
import {Sidebar} from '../components/Sidebar'
import styled from '@emotion/styled'
import * as theme from '../theme'
import {DimensionalBox} from "../components/DimensionalBox";
import {whenSmallScreen} from "../theme";
import {whenTablet} from "../theme";

const H1 = ({children}) => <h1 css={{
  fontSize: 40,
  alignSelf: 'flex-start',
  '& > div > div > code ': {
    fontSize: '2rem !important',
    color: theme.red,
    fontFamily: 'Basier Square Mono !important',
  }
}}><Highlight h1>{children}</Highlight></h1>

const H2 = ({children}) => <h2 css={{
  '& > code': {
    fontSize: '1.14rem !important',
    color: theme.red,
    fontFamily: 'Basier Square Mono !important',
  }
}}>{children}</h2>

const H3 = ({children}) =>
  <h3 css={{
    fontSize: '1.14rem',
    marginTop: '4rem',
    display: 'flex',
    '& > div > div > code': {
      color: theme.red,
      background: 'unset !important',
      fontFamily: 'Basier Square Mono !important',
      fontSize: 'unset',
    }
  }}><Highlight code>{children}</Highlight></h3>

const H4 = ({children}) => <h4 css={{fontSize: 17, textTransform: 'capitalize', marginBottom: 12,}}>{children}</h4>

const Ul = ({children}) => <div>{children}</div>

const Li = ({children}) => <li css={{lineHeight: '24px', marginBottom: 12,}}>{children}</li>

const Pre = ({children}) => <DimensionalBox rootCss={{alignItems: 'center', marginBottom: 40}} maxWidth={720}>
  <pre css={{margin: 0, overflow: 'auto', width: '100%', padding: '12px 0', paddingLeft: 24,}}>{children}</pre>
</DimensionalBox>

const Code = ({children}) => <code className={'language-jsx'}>{children}</code>

const P = ({children}) => <p
  css={{fontSize: 16, marginBottom: 12, marginTop: 0, lineHeight: '1.6rem', marginLeft: '2.2rem',}}>{children}</p>

const Blockquote = ({children}) =>
  <div css={{display: 'flex', marginBottom: 20,}}>
    <div css={{flexShrink: 0, width: 4, backgroundColor: theme.darkBlue,}}/>
    <div css={{
      flexGrow: 1,
      backgroundColor: theme.lightBlue,
      padding: '4px 12px',
      '& > p': {margin: 0, fontSize: 15, color: theme.darkGrey, lineHeight: '1.4rem'}
    }}>
      {children}
    </div>
  </div>

const renderAst = new RehypeReact({
  createElement: React.createElement,
  components: {
    h1: H1,
    h2: H2,
    h3: H3,
    h4: H4,
    // ul: Ul,
    p: P,
    li: Li,
    pre: Pre,
    code: Code,
    blockquote: Blockquote,
  },
}).Compiler

const Container = styled.div({
  display: 'flex',
  height: '100%',
  overflow: 'auto',
  justifyContent: 'center',
  position: 'relative',

  '& > :last-child': {
    maxWidth: 720,
    display: 'flex',
    flexDirection: 'column',

    [whenSmallScreen]: {
      maxWidth: 'calc(100vw - 420px)',
    },

    [whenTablet]: {
      maxWidth: 'calc(100vw - 64px)',
      paddingTop: 64,
    },
  }
})

export default class Template extends React.Component {
  componentDidMount() {
    const hash = window.decodeURI(window.location.hash.replace('#', ''))
    if (hash !== '') {
      const element = document.getElementById(hash)
      if (element) {
        element.firstElementChild.click()
      }
    }
  }

  render() {
    const {data} = this.props
    const {markdownRemark} = data
    const {frontmatter, htmlAst} = markdownRemark

    return (
      <Layout>
        <Container>
          <Sidebar/>
          {renderAst(htmlAst)}
        </Container>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      htmlAst
      frontmatter {
        path
        title
      }
    }
  }
`
