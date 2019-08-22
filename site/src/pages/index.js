import React from "react"
import { Link } from "gatsby"
import styled from 'styled-components'
import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const Header = styled.h1`
  padding: 100px
`
const IndexPage = () => (
  <Layout>
    <SEO title="framework-x: Reasonable global state" />
    <Header>Framework-x</Header>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/learn">Learn</Link>
    <Link to="/api">API</Link>
  </Layout>
)

export default IndexPage
