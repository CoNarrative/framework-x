import React from 'react'
import {Link} from 'gatsby'
import {jsx} from '@emotion/core'
import styled from '@emotion/styled'
import Layout from '../components/layout'
import MulletManFluid from '../components/image'
import SEO from '../components/seo'
import {DimensionalBox} from '../components/DimensionalBox'
import axios from 'axios'
// import "prismjs/themes/prism-solarizedlight.css"
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import {Highlight} from '../components/TextBackgroundHighlight'
// import "prismjs/plugins/command-line/prism-command-line.css"
import CircleBackdrop from '../images/circle-backdrop.svg'

const MulletManMain = () =>
  <div css={{width: '60%'}}>
    <MulletManFluid/>
  </div>


const MainContent = ({starCount, downloadCount}) =>
  <div css={{display: 'flex', maxWidth: 960, alignSelf: 'center',}}>
    <MulletManMain/>
    <div css={{paddingBottom: '4rem'}}>
      <h1 css={{marginBottom: '0.8rem', display: 'flex'}}>
        Reasonable <Highlight rootCss={{marginLeft: 10}}>global state.</Highlight>
      </h1>
      <div css={{marginBottom: '1.45rem', fontFamily: 'Basier Square Mono', lineHeight: '1.4rem'}}>
        Framework-X is a Javascript framework that processes definitions of cause and
        effect.
        Applications define what their events mean by mapping them to descriptions of the
        effects they entail -- a state change, an
        asynchronous API call, the invocation of a custom function, or another event.
      </div>

      <div css={{maxWidth: `300px`, marginBottom: `1.45rem`}}>
        <DimensionalBox rootCss={{alignItems: 'center',}} width={520} height={39}>
          <div css={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            paddingBottom: 6,
            '& > :not(:last-child)': {marginRight: 64}
          }}>
            <span>License: MIT</span>
            <a href={'https://github.com/CoNarrative/framework-x'}
               target={'_blank'}
               style={{color: 'inherit', textDecoration: 'inherit'}}>
              +{starCount} stars
            </a>
            <a href={'https://www.npmjs.com/package/framework-x'}
               target={'_blank'}
               style={{color: 'inherit', textDecoration: 'inherit'}}>
              +{downloadCount} downloads
            </a>
            {/*<span></span>*/}
          </div>
        </DimensionalBox>
      </div>
    </div>
  </div>

const npmReqUrl = 'https://api.npmjs.org/downloads/point/last-month/framework-x'
const getNPMDownloadCount = async () => {
  const res = await axios(npmReqUrl)
  return res.data.downloads
}

const GITHUB_TOKEN = '2c6e7156347d7346d3b3bcd5bf0918e61007d16b'
const ghRepoUrl = 'https://api.github.com/repos/CoNarrative/framework-x'
const getGithubStarCount = async () => {
  const headers = {
    'Authorization': `token ${GITHUB_TOKEN}`,
  }
  const res = await axios({url: ghRepoUrl, headers})

  const {stargazers_count} = res.data
  return stargazers_count
}

class MainContentAsyncStuff extends React.Component {
  constructor(props) {
    super(props)
    this.state = {starCount: '--', downloadCount: '--'}
  }

  UNSAFE_componentWillMount() {
    Promise.all([getNPMDownloadCount(), getGithubStarCount()]).then(([a, b]) => {
      this.setState({starCount: b, downloadCount: a})
    })
  }

  render() {
    return <MainContent {...this.state} />
  }
}

const IndexPage = () => {
  return (
    <Layout>
      <SEO title="framework-x: Reasonable global state"/>

      <div css={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        flexShrink: 0,
        backgroundImage: 'url(' + CircleBackdrop + ')',
        backgroundSize: 'cover',
        zIndex: -1
      }}>
        <MainContentAsyncStuff/>
      </div>

    </Layout>
  )
}

export default IndexPage
