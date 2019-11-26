import React from 'react'
import {graphql} from 'gatsby'
import RehypeReact from 'rehype-react'
import Layout from '../components/layout'
import SEO from '../components/seo'
import {Highlight} from '../components/TextBackgroundHighlight'
import {TableOfContents} from '../components/TableOfContents'
import styled from '@emotion/styled'
import * as theme from '../theme'
import {DimensionalBox} from "../components/DimensionalBox";
import {whenSmallScreen} from "../theme";
import {whenTablet} from "../theme";
import {whenMobile} from "../theme";
import {Footer} from "../components/Footer";

const H1 = ({id, children}) => <h1 id={id} css={{
  fontSize: 40,
  alignSelf: 'flex-start',
  '& > div > div > code ': {
    fontSize: '2rem !important',
    color: theme.red,
    fontFamily: 'Basier Square Mono !important',
  },

  [whenMobile]: {
    fontSize: '2.04rem'
  },
}}><Highlight h1>{children}</Highlight></h1>

const H2 = ({id, children}) => <h2 id={id} css={{
  '& > code': {
    fontSize: '1.14rem !important',
    color: theme.red,
    fontFamily: 'Basier Square Mono !important',
  }
}}>{children}</h2>

const H3 = ({id, children}) =>
  <h3 id={id} css={{
    fontSize: '1.14rem',
    marginTop: '4rem',
    display: 'flex',
    '& > div > div > code': {
      color: theme.red,
      background: 'unset !important',
      fontFamily: 'Basier Square Mono !important',
      fontSize: 'unset',
    },
    [whenMobile]: {
      fontSize: '1.02rem'
    },
  }}><Highlight code>{children}</Highlight></h3>

const H4 = ({children}) => <h4 css={{fontSize: 17, textTransform: 'capitalize', marginBottom: 12,}}>{children}</h4>

// used to hide Table of Contents
const H6 = ({children}) => null

const Ul = ({children}) => <div>{children}</div>

const Li = ({children}) => <li
  css={{lineHeight: '24px', marginBottom: 12, [whenMobile]: {fontSize: 14,}}}>{children}</li>

const Pre = ({children}) => <div css={{marginBottom: 40}}><DimensionalBox handleHeight={true}
                                                                          rootCss={{alignItems: 'center'}}
                                                                          maxWidth={720}>
  <pre css={{margin: 0, overflow: 'auto', width: '100%', padding: '12px 0', paddingLeft: 24,}}>{children}</pre>
</DimensionalBox></div>

const Code = ({children}) => <code className={'language-jsx'}>{children}</code>

const P = ({children}) => <p
  css={{
    fontSize: 16,
    marginBottom: 12,
    marginTop: 0,
    lineHeight: '1.6rem',
    marginLeft: '2.2rem',
    [whenMobile]: {marginLeft: 0, fontSize: 14}
  }}>{children}</p>

const Blockquote = ({children}) =>
  <div css={{display: 'flex', display: '-webkit-box', marginBottom: 20,}}>
    <div css={{display: 'block', flexShrink: 0, width: 4, backgroundColor: theme.darkBlue,}}/>
    <div css={{
      display: 'flex',
      flexGrow: 1,
      backgroundColor: theme.lightBlue,
      padding: '4px 12px',
      '& > p': {
        margin: 0,
        fontSize: 15,
        color: theme.darkGrey,
        lineHeight: '1.4rem',
        [whenMobile]: {
          fontSize: 13,
          lineHeight: '1.1rem',
        },
      },
      [whenMobile]: {
        padding: '8px 12px',
      }
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
    h6: H6,
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
  overflowX: 'hidden',
  justifyContent: 'center',
  position: 'relative',
  '-webkit-overflow-scrolling': 'touch',

  '& > :last-child > :first-child': {
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

    [whenMobile]: {
      maxWidth: 'calc(100vw - 32px)',
      paddingTop: 0,
    },

    '& > :first-child': {
      paddingTop: 24,
    },

    '& > :last-child': {
      paddingBottom: 80,
    },
  }
})

const tocRelLinks = (toc) => {
  return toc.split('href=')
    .filter(x => x.startsWith('"'))
    .map(x => x.slice(x.indexOf('#') + 1, x.indexOf('>') - 1))
}

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
    const {
      frontmatter, htmlAst, headings, tableOfContents: tocHTML,
    } = markdownRemark

    const rellinks = tocRelLinks(tocHTML)

    const tableOfContents = headings && headings.filter(x => x.depth <= 2)
      .map((x, i) => ({
        id: rellinks[i],
        innerHTML: x.value
      }))
    return (
      <Layout showToc={true} tableOfContents={tableOfContents}>
        <SEO />
        <Container>
          <TableOfContents tableOfContents={tableOfContents} rootCss={{[whenMobile]: {display: 'none'}}}/>
          <div>
              {renderAst(htmlAst)}
            <Footer floating/>
          </div>
        </Container>
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      htmlAst
      tableOfContents(heading: "Table of Contents", pathToSlugField: "frontmatter.path", maxDepth: 3)
      frontmatter {
        path
        title
      }
      headings {
        value
        depth
      }
    }
  }
`
