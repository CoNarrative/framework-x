/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import Header, {Navigation} from "./Navigation"

const Layout = ({ children, rootCss }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <Navigation siteTitle={data.site.siteMetadata.title} />
      <div
        css={{
          margin: `0 auto`,
          // padding: `0px 1.0875rem 1.45rem`,
          // paddingTop: 0,
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          ...rootCss
        }}
      >
        <React.Fragment>{children}</React.Fragment>
        {/*<footer>*/}
        {/*  © {new Date().getFullYear()} {" "}*/}
        {/*  <a href="https://conarrative.com">CoNarrative</a>*/}
        {/*</footer>*/}
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
