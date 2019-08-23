import React from 'react'
import { graphql } from 'gatsby'
import RehypeReact from 'rehype-react'

const H1 = ({ children }) => <div>{children}</div>

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
    // h1: H1,
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
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, htmlAst } = markdownRemark
  return (
    <div className="blog-post">
      <h1>{frontmatter.title}</h1>
      {/*<h2>{frontmatter.date}</h2>*/}
      <div
        className="blog-post-content"
        // dangerouslySetInnerHTML={{ __html: html }}
      />
      {renderAst(htmlAst)}
    </div>
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
