/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require('path')

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const mainPage = path.resolve(`src/templates/index.js`)
  createPage({
    path: '/',
    component: mainPage,
    context: {}
  })

  const markdownContentPageTemplate = path.resolve(`src/templates/post.js`)

  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              path
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    console.log(JSON.stringify(result.errors, null, 2))
    throw new Error('Everything sucks')
  }

  result.data.allMarkdownRemark.edges.forEach(({ node }) => {
    createPage({
      path: node.frontmatter.path,
      component: markdownContentPageTemplate,
      context: {}, // additional data can be passed via context
    })
  })
}
