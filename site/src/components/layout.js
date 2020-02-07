/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import {useStaticQuery, graphql} from "gatsby"
import {Navigation} from "./Navigation"
import {whenMobile} from "../theme";
import {TableOfContents} from "./TableOfContents";

class Layout extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
    }
  }

  isHamburgerMenuExpanded = (isExpanded) => {
    this.setState({expanded: isExpanded})
  }

  render() {
    const {children, rootCss, tableOfContents, showToc} = this.props
  //   const data = useStaticQuery(graphql`
  //   query SiteTitleQuery {
  //     site {
  //       siteMetadata {
  //         title
  //       }
  //     }
  //   }
  // `)
    return (
      <React.Fragment>
        {/*<Navigation siteTitle={data.site.siteMetadata.title}/>*/}
        <Navigation isHamburgerMenuExpanded={this.isHamburgerMenuExpanded}/>
        <TableOfContents tableOfContents={tableOfContents} rootCss={{
          display: 'none',
          [whenMobile]: {
            display: showToc ? 'flex' : 'none',
            top: this.state.expanded ? 112 : 64,
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
            overflowX: 'hidden',
            position: 'relative',
            top: 64,

            [whenMobile]: {
              position: 'relative',
              top: 112,
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
      </React.Fragment>
    )
  }
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
