/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require(`path`)
const axios = require('axios')

const getNPMDownloadCount = async () => {
  const url = 'https://api.npmjs.org/downloads/point/last-month/framework-x'
  const res = await axios(url)
  const { downloads } = res.data
  return downloads
}

const GITHUB_TOKEN = '2c6e7156347d7346d3b3bcd5bf0918e61007d16b'
const getGithubStarCount = async () => {
  const url = 'https://api.github.com/repos/CoNarrative/framework-x'
  const headers = { 'Authorization': `token ${GITHUB_TOKEN}` }
  const res = await axios({ url, headers })
  return res.data.stargazers_count
}
exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  const downloadCount = await getNPMDownloadCount()
  const starCount = await getGithubStarCount()
  console.log('counts', [downloadCount,starCount])

  const mainPage = path.resolve(`src/templates/index.js`)
  createPage({
    path:'/',
    component:mainPage,
    context:{downloadCount,starCount}
  })
  const blogPostTemplate = path.resolve(`src/templates/post.js`)

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
      component: blogPostTemplate,
      context: {}, // additional data can be passed via context
    })
  })
}
