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
    <SEO title="Home" />
    <Header>Hi people</Header>
    <p>Welcome to your new Gatsby site.</p>
    <p>Now go build something great.</p>
    <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
    </div>
    <Link to="/page-2/">Go to page 2</Link>
  </Layout>
)

export default IndexPage
