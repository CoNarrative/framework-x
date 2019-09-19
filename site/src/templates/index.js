import React from 'react'
import MulletManFluid from '../components/image'
import {DimensionalBox} from '../components/DimensionalBox'
import {Highlight} from '../components/TextBackgroundHighlight'
import CircleBackdrop from '../images/circle-backdrop.svg'
import HelpDesk from '../images/help-desk.svg'
import {Input, MultilineInput} from "../components/Input";
import {Button, Button3D} from "../components/Button";
import Enter from '../assets/icons/enter.svg'
import {Link} from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import {Footer} from "../components/Footer";
import * as axios from "axios";
import {whenMobile, whenTablet} from "../theme";

const MulletManMain = () =>
  <div css={{width: '60%', [whenMobile]: {alignSelf: 'center'}}}>
    <MulletManFluid/>
  </div>

export const Banner = ({children, rootCss, wrapCss}) => (
  <div css={{display: 'flex', justifyContent: 'center', paddingTop: 64, paddingBottom: 80, ...rootCss,}}>
    <div css={{
      width: '100%',
      maxWidth: 1440,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 64px',
      position: 'relative',

      ...wrapCss
    }}>
      {children}
    </div>
  </div>
)

const ContactUs = () => (
  <Banner rootCss={{backgroundColor: '#E4E6EB'}} wrapCss={{
    [whenTablet]: {flexDirection: 'column-reverse',},
    [whenMobile]: {paddingLeft: 24, paddingRight: 24,}
  }}>
    <div css={{display: 'flex', flexDirection: 'column', flexShrink: 1, maxWidth: 540,}}>
      <h1 css={{marginTop: 0, fontSize: '3rem', marginBottom: '0.8rem', display: 'flex'}}>Need a helping hand?</h1>
      <span css={{fontFamily: 'Basier Square Mono', fontSize: '1.04rem', marginBottom: 20, lineHeight: '1.6rem',}}>Please feel free to reach out to us at anytime to discuss our consulting services.</span>
      <div>
        {/*<DimensionalBox handleHeight={true} rootCss={{*/}
        {/*  padding: '16px 24px',*/}
        {/*  alignItems: 'flex-end',*/}
        {/*  [whenMobile]: {flexDirection: 'column', alignItems: 'stretch'}*/}
        {/*}}>*/}
        {/*  <div css={{*/}
        {/*    marginRight: 24,*/}
        {/*    flexGrow: 1,*/}
        {/*    flexShrink: 1,*/}
        {/*    display: 'flex',*/}
        {/*    flexDirection: 'column',*/}
        {/*    [whenMobile]: {marginRight: 0}*/}
        {/*  }}>*/}
        {/*    <Input placeholder={'name'} rootCss={{marginBottom: 12,}}/>*/}
        {/*    <Input placeholder={'e-mail address'} rootCss={{marginBottom: 20}}/>*/}
        {/*    <MultilineInput placeholder={'message'}/>*/}
        {/*  </div>*/}
        {/*  <Button rootCss={{*/}
        {/*    width: 96,*/}
        {/*    flexShrink: 1,*/}
        {/*    minWidth: 64,*/}
        {/*    [whenMobile]: {marginTop: 24, alignSelf: 'flex-end'}*/}
        {/*  }}><img css={{height: 13,}} src={Enter}/></Button>*/}
        {/*</DimensionalBox>*/}
        <a href={'https://www.conarrative.com/'}>
          <Button3D>Visit our website</Button3D>
        </a>
      </div>
    </div>
    <img css={{
      width: '40%',
      maxHeight: 360,
      marginLeft: 80,
      [whenTablet]: {marginLeft: 0, marginBottom: 64, width: '70%', minWidth: 280}
    }} src={HelpDesk}/>
  </Banner>

)

const MainContent = ({starCount, downloadCount}) =>
  <div css={{
    display: 'flex',
    maxWidth: 960,
    alignSelf: 'center',
    paddingBottom: '4rem',
    [whenMobile]: {flexDirection: 'column', padding: '0 24px', paddingBottom: '3rem'}
  }}>
    <MulletManMain/>
    <div css={{display: 'flex', flexDirection: 'column'}}>
      <h1 css={{fontSize: '3rem', marginBottom: '0.8rem', display: 'flex', flexWrap: 'wrap'}}>
        Reasonable <Highlight rootCss={{marginLeft: 10}}>global state.</Highlight>
      </h1>
      <div css={{marginBottom: '1.45rem', fontFamily: 'Basier Square Mono', lineHeight: '1.4rem'}}>
        Framework-X is a Javascript framework that processes definitions of cause and
        effect.
        Applications define what their events mean by mapping them to descriptions of the
        effects they entail -- a state change, an
        asynchronous API call, the invocation of a custom function, or another event.
      </div>
      <div css={{ display: 'flex', [whenMobile]: {flexDirection: 'column'}}}>
        <div css={{alignSelf: 'flex-start', [whenMobile]: {width: '100%'}}}>
          <DimensionalBox handleHeight={true} rootCss={{alignItems: 'center'}}>
            <div css={{
              display: 'flex',
              justifyContent: 'center',
              width: 520,
              paddingTop: 9,
              paddingBottom: 9,
              '& > :not(:last-child)': {marginRight: 64},
              [whenMobile]: {
                flexDirection: 'column',
                width: '100%',
                paddingLeft: 24,
                paddingTop: 16,
                paddingBottom: 16,
                '& > :not(:last-child)': {marginRight: 0, marginBottom: 12},
              },
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
            </div>
          </DimensionalBox>
        </div>
        <Link to={'/api'} css={{marginLeft: 32, [whenMobile]:{marginLeft: 0, marginTop: 24}}}>
          <Button3D>Go to documentation</Button3D>
        </Link>
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
    <Layout rootCss={{
      [whenMobile]: {
        position: 'relative',
        top: 64,
        height: 'calc(100vh - 64px)',
      },
    }}>
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

        [whenMobile]: {
          height: 'unset',
        }
      }}>
        <MainContentAsyncStuff/>
      </div>
      <ContactUs/>
      <Footer/>

    </Layout>
  )
}

export default IndexPage
