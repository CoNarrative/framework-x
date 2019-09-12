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
import {whenMobile} from "../theme";
import {Sidebar} from "./Sidebar";

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
      <Sidebar rootCss={{
        display: 'none',
        [whenMobile]: {
          display: 'flex',
          top: 64,
          right: 0,
          left: 0,
          paddingLeft: 0,
          marginRight: 0,
          width: 'unset',
        },
      }}/>
      <div
        css={{
          margin: `0 auto`,
          // padding: `0px 1.0875rem 1.45rem`,
          // paddingTop: 0,
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',

          [whenMobile]: {
            height: 'calc(100vh - 112px)',
          },

          ...rootCss,
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
