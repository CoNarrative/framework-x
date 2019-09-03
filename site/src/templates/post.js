import React from 'react'
import { graphql } from 'gatsby'
import RehypeReact from 'rehype-react'
import Layout from '../components/layout'
import { Highlight } from '../components/TextBackgroundHighlight'

const H1 = ({ children }) => <h1><Highlight>{children}</Highlight></h1>

const H2 = ({ children }) => <div>{children}</div>

const H3 = ({ children }) => <div>{children}</div>

const Ul = ({ children }) => <div>{children}</div>

const Li = ({ children }) => <div>{children}</div>

const Pre = ({ children }) => <div>{children}</div>

const Code = ({ children }) => <div>{children}</div>

const P = ({ children }) => <div>{children}</div>

const renderAst = new RehypeReact({
  createElement: React.createElement,
  components: {
    h1: H1,
    // h2: H2,
    // h3: H3,
    // ul: Ul,
    // p: P,
    // li: Li,
    // pre: Pre,
    // code: Code,
  },
}).Compiler

export default function Template({ data }) {
  const { markdownRemark } = data
  const { frontmatter, htmlAst } = markdownRemark

  return (
    <Layout>
    <div className="blog-post">
      <h1>{frontmatter.title}</h1>
      <div
        style={{ paddingLeft: '5em', paddingRight: '5em' }}
      >
        {renderAst(htmlAst)}
      </div>
    </div>
    </Layout>
  )
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
