import React from 'react'
import { graphql } from 'gatsby'
import RehypeReact from 'rehype-react'
import Layout from '../components/layout'
import { Highlight } from '../components/TextBackgroundHighlight'
import { Sidebar } from '../components/Sidebar'
import styled from '@emotion/styled'

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

const Container = styled.div({
  display: 'flex',
  height: '100%',
  overflow: 'auto'
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
    const { data } = this.props
    const { markdownRemark } = data
    const { frontmatter, htmlAst } = markdownRemark

    return (
      <Layout>
        <Container>
          <Sidebar />
          <div>
            <h1>{frontmatter.title}</h1>
            <div
              style={{ paddingLeft: '5em', paddingRight: '5em' }}
            >
              {renderAst(htmlAst)}
            </div>
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
      frontmatter {
        path
        title
      }
    }
  }
`
