import React from 'react'
import MulletManFluid from '../components/image'
import {DimensionalBox} from '../components/DimensionalBox'
import {Highlight} from '../components/TextBackgroundHighlight'
import CircleBackdrop from '../images/circle-backdrop.svg'
import HelpDesk from '../images/help-desk.svg'
import {Input, MultilineInput} from "../components/Input";
import {Button} from "../components/Button";
import Enter from '../assets/icons/enter.svg'
import Layout from '../components/layout'
import SEO from '../components/seo'
import {Footer} from "../components/Footer";
import * as axios from "axios";

const MulletManMain = () =>
  <div css={{width: '60%'}}>
    <MulletManFluid/>
  </div>

export const Banner = ({children, rootCss}) => (
  <div css={{height: 520, display: 'flex', justifyContent: 'center', backgroundColor: '#E4E6EB', ...rootCss,}}>
    <div css={{width: '100%', maxWidth: 1280, display: 'flex', justifyContent: 'space-between', alignItems: 'center',}}>
      {children}
    </div>
  </div>
)

const ContactUs = () => (
  <div css={{height: 520, display: 'flex', justifyContent: 'center', backgroundColor: '#E4E6EB'}}>
    <div css={{width: '100%', maxWidth: 1280, display: 'flex', justifyContent: 'space-between', alignItems: 'center',}}>
      <div css={{display: 'flex', flexDirection: 'column', flexShrink: 0, maxWidth: 540,}}>
        <h1 css={{marginTop: 0, fontSize: '3rem', marginBottom: '0.8rem', display: 'flex'}}>Need a helping hand?</h1>
        <span css={{fontFamily: 'Basier Square Mono', fontSize: '1.04rem', marginBottom: 20, lineHeight: '1.6rem',}}>Please feel free to reach out to us at anytime to discuss our consulting services.</span>
        <div>
          <DimensionalBox handleHeight={true} rootCss={{padding: '16px 24px', alignItems: 'flex-end'}}>
            <div css={{marginRight: 24, flexGrow: 1, flexShrink: 1, display: 'flex', flexDirection: 'column'}}>
              <Input placeholder={'name'} rootCss={{marginBottom: 12,}}/>
              <Input placeholder={'e-mail address'} rootCss={{marginBottom: 20}}/>
              <MultilineInput placeholder={'message'}/>
            </div>
            <Button rootCss={{width: 96,}}><img css={{height: 13,}} src={Enter}/></Button>
          </DimensionalBox>
        </div>
      </div>
      <img src={HelpDesk}/>
    </div>
  </div>
)

const MainContent = ({starCount, downloadCount}) =>
  <div css={{display: 'flex', maxWidth: 960, alignSelf: 'center',}}>
    <MulletManMain/>
    <div css={{paddingBottom: '4rem'}}>
      <h1 css={{fontSize: '3rem', marginBottom: '0.8rem', display: 'flex'}}>
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
        <DimensionalBox rootCss={{alignItems: 'center',}} width={520}>
          <div css={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            paddingTop: 6,
            paddingBottom: 12,
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
      <ContactUs/>
      <Footer/>

    </Layout>
  )
}

export default IndexPage
