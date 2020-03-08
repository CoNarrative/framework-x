import {OutboundLink} from 'gatsby-plugin-google-analytics'
import React from 'react'
import styled from '@emotion/styled'
import MulletManFluid from '../components/image'
import {DimensionalBox} from '../components/DimensionalBox'
import {Highlight} from '../components/TextBackgroundHighlight'
import CircleBackdrop from '../images/circle-backdrop.svg'
import HelpDesk from '../images/help-desk.svg'
import {Input, MultilineInput} from '../components/Input'
import {Button, Button3D} from '../components/Button'
import Enter from '../assets/icons/enter.svg'
import {Link} from 'gatsby'
import Layout from '../components/layout'
import SEO from '../components/seo'
import {Footer} from '../components/Footer'
import * as axios from 'axios'
import MulletMan from '../assets/icons/mascot.svg'
import * as theme from '../theme'
import {Shapes} from '../images/Shapes'
import {TreeDiagram} from '../images/TreeDiagram'
import {LessCodeDiagram} from '../images/LessCode'
import {Tetris} from '../images/Tetris'
import handleViewport from 'react-in-viewport'

const MulletManMain = () =>
  <div css={{
    width: 200,
    minWidth: 120,
    marginRight: '2.4rem',
    [theme.whenMobile]: {
      alignSelf: 'center',
      marginTop: 40,
      width: '30%',
      marginBottom: 40,
      marginRight: 0,
    }
  }}>
    <img src={MulletMan}/>
  </div>

export const Banner = ({children, rootCss, wrapCss}) => (
  <div css={{
    display: 'flex',
    justifyContent: 'center',
    paddingTop: 64,
    paddingBottom: 80, ...rootCss,
  }}>
    <div css={{
      width: '100vw',
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

const Features = () => (
  <Banner rootCss={{backgroundColor: theme.black, color: 'white'}} wrapCss={{
    [theme.whenTablet]: {flexDirection: 'column',},
    [theme.whenMobile]: {paddingLeft: 24, paddingRight: 24,}
  }}>
    <Shapes/>
    <div css={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      flexShrink: 1,
      maxWidth: 540,
      marginRight: 120,
      [theme.whenTablet]: {marginTop: 0, marginRight: 0},
    }}>
      <h1 css={{
        marginTop: 0,
        fontSize: '2.4rem',
        marginBottom: '1.2rem',
        display: 'flex',
        [theme.whenMobile]: {
          fontSize: '2rem',
        },
      }}>Key features</h1>
      <ol css={{
        fontFamily: 'Basier Square Mono',
        fontSize: '1.04rem',
        margin: 0,
        marginBottom: 20,
        lineHeight: '1.6rem',
        color: '#CBD2E4',
        '& > li': {marginBottom: 12,},
        [theme.whenMobile]: {
          fontSize: '0.88rem',
          lineHeight: '1.2rem'
        },
      }}>
        <li>Less code</li>
        <li>Single source of truth</li>
        <li>Executable effect descriptions</li>
      </ol>
      <Link to={'/learn'} css={{width: '100%'}}>
        <Button3D light rootCss={{width: '100%'}}>Learn more</Button3D>
      </Link>
    </div>
  </Banner>
)

const AnimationBlock = ({children}) => (
  <div css={{
    minHeight: 900,
    height: 'calc(100vh - 64px)',
    width: 1020,
    flexShrink: 0,
    alignSelf: 'center',
    display: 'flex',
    alignItems: 'center',
    [theme.whenTablet]: {
      width: '100%',
      paddingLeft: 20,
      paddingRight: 20,
    },
    [theme.whenMobile]: {
      minHeight: 680
    }
  }}>
    <div css={{
      maxHeight: 720,
      width: '100%',
      height: '100%',
      display: 'flex',
      position: 'relative',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',

      // '& > :last-child': {
      //   position: 'absolute',
      //   bottom: 0,
      // },

      [theme.whenMobile]: {
        maxHeight: 548,
      }
    }}>
      {children}
    </div>
  </div>
)

const Animation = styled.div({
  flexGrow: 1,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
})

class AnimationDescriptionBlock extends React.Component {
  animateOnce = () => {
    const {inViewport, enterCount} = this.props

    if (enterCount === 0) {
      return {
        opacity: inViewport ? 1 : 0,
        top: inViewport ? 40 : 0,
      }
    } else {
      return {
        opacity: 1,
        top: 0,
      }
    }
  }

  render() {
    const {header, description, rootCss, forwardedRef} = this.props

    return (
      <div
        ref={forwardedRef}
        css={{
          maxWidth: 520,
          height: 'auto',
          backgroundColor: '#C1ECE1',
          color: '#141515',
          border: '1px solid #141515',
          paddingTop: 28,
          paddingBottom: 32,
          paddingLeft: 40,
          paddingRight: 40,
          transition: 'all 1000ms ease',
          position: 'relative',
          justifySelf: 'flex-start',
          ...rootCss,
        }}
        style={this.animateOnce()}>
        <div css={{fontFamily: theme.defaultFontFamily, fontSize: 24, fontWeight: 900, marginBottom: 12}}>{header}</div>
        <div
          css={{
            fontFamily: theme.altFontFamily,
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '22.8px'
          }}>{description}</div>
      </div>
    )
  }
}

const AnimationDescription = handleViewport(AnimationDescriptionBlock, {}, {disconnectOnLeave: true})

const ContactUs = () => (
  <Banner rootCss={{backgroundColor: '#E4E6EB'}} wrapCss={{
    [theme.whenTablet]: {flexDirection: 'column-reverse',},
    [theme.whenMobile]: {paddingLeft: 24, paddingRight: 24,}
  }}>
    <div
      css={{display: 'flex', flexDirection: 'column', flexShrink: 1, maxWidth: 540,}}>
      <h1 css={{
        marginTop: 0,
        fontSize: '3rem',
        marginBottom: '0.8rem',
        display: 'flex'
      }}>Need a helping hand?</h1>
      <span css={{
        fontFamily: 'Basier Square Mono',
        fontSize: '1.04rem',
        marginBottom: 20,
        lineHeight: '1.6rem',
      }}>Please feel free to reach out to us at anytime to discuss our consulting services.</span>
      <div>
        <a href={'https://www.conarrative.com/'} css={{[theme.whenMobile]: {width: '100%'}}}>
          <Button3D css={{[theme.whenMobile]: {width: '100%'}}}>Visit our website</Button3D>
        </a>
      </div>
    </div>
    <img css={{
      width: '40%',
      maxHeight: 360,
      marginLeft: 80,
      [theme.whenTablet]: {marginLeft: 0, marginBottom: 64, width: '70%', minWidth: 280}
    }} src={HelpDesk}/>
  </Banner>
)

const MainContent = ({starCount, downloadCount}) =>
  <div css={{
    display: 'flex',
    maxWidth: 960,
    alignSelf: 'center',
    paddingBottom: '4rem',
    [theme.whenTablet]: {paddingLeft: 48, paddingRight: 48  },
    [theme.whenMobile]: {flexDirection: 'column', padding: '0 24px', paddingBottom: '3rem'}
  }}>
    <MulletManMain/>
    <div css={{display: 'flex', flexDirection: 'column'}}>
      <h1 css={{
        fontSize: '3rem',
        marginBottom: '0.8rem',
        display: 'flex',
        flexWrap: 'wrap',
        marginTop: 0
      }}>
        A Reasonable <Highlight rootCss={{marginLeft: 10}}>Programming Framework.</Highlight>
      </h1>
      <div css={{
        marginBottom: '1.45rem',
        fontFamily: 'Basier Square Mono',
        lineHeight: '1.7rem'
      }}>
        Framework-X is a Javascript framework that processes definitions of cause and
        effect.
        Applications define what their events mean by mapping them to descriptions of the
        effects they entail -- a state change, an
        asynchronous API call, the invocation of a custom function, or another event.
      </div>
      <div css={{display: 'flex', flexWrap: 'wrap', [theme.whenMobile]: {flexDirection: 'column'}}}>
        <div css={{alignSelf: 'flex-start', marginRight: 32, marginBottom: 24, [theme.whenMobile]: {width: '100%'}}}>
          <DimensionalBox handleHeight={true} rootCss={{alignItems: 'center'}}>
            <div css={{
              display: 'flex',
              justifyContent: 'center',
              width: 480,
              paddingTop: 9,
              paddingBottom: 9,
              '& > :not(:last-child)': {marginRight: 64},
              [theme.whenMobile]: {
                flexDirection: 'column',
                width: '100%',
                paddingLeft: 24,
                paddingTop: 16,
                paddingBottom: 16,
                '& > :not(:last-child)': {marginRight: 0, marginBottom: 12},
              },
            }}>
              <span>License: MIT</span>
              <OutboundLink href={'https://github.com/CoNarrative/framework-x'}
                            target={'_blank'}
                            style={{color: 'inherit', textDecoration: 'inherit'}}>
                +{starCount} stars
              </OutboundLink>
              <OutboundLink href={'https://www.npmjs.com/package/framework-x'}
                            target={'_blank'}
                            style={{color: 'inherit', textDecoration: 'inherit'}}>
                +{downloadCount} downloads
              </OutboundLink>
            </div>
          </DimensionalBox>
        </div>
        <Link to={'/learn'}
              css={{[theme.whenMobile]: {marginLeft: 0, [theme.whenMobile]: {width: '100%'}}}}>
          <Button3D rootCss={{[theme.whenMobile]: {width: '100%'}}}>Learn more</Button3D>
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
      [theme.whenMobile]: {
        position: 'relative',
        top: 64,
        height: 'calc(100vh - 64px)',
      },
    }}>
      <SEO/>

      <div css={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        flexShrink: 0,
        backgroundImage: 'url(' + CircleBackdrop + ')',
        backgroundSize: 'cover',

        [theme.whenMobile]: {
          height: 'unset',
        }
      }}>
        <MainContentAsyncStuff/>
      </div>
      <Features/>
      <AnimationBlock>
        <AnimationDescription header={'Add without breaking.'}
                              description={
                                            'When you want to add a new feature, you shouldn\'t need to modify existing ones. '
                                           + 'Framework-X apps reflect this in code. Each feature has its own area. They can be extended without modifying working code.'}
                              rootCss={{
                                justifySelf: 'flex-start',
                                [theme.whenTablet]: {left: 0, marginLeft: 40},
                                [theme.whenMobile]: {marginLeft: 20, marginRight: 20, paddingLeft: 24, paddingRight: 24, paddingTop: 20, paddingBottom: 24}
                              }}/>

        <Animation>
          <TreeDiagram width={'140%'} maxHeight={354}/>
        </Animation>
      </AnimationBlock>
      <AnimationBlock>
        <AnimationDescription header={'Write 40% less code.'}
                              description={
                                'With Framework-X, you can write the same app in 40% fewer lines of code than Redux, Angular, or other Javascript frameworks. '
                              + 'More expressive code can promote faster development, increased productivity, and clearer communication.'}
                              rootCss={{
                                [theme.whenTablet]: {right: 0, marginRight: 40},
                                [theme.whenMobile]: {marginLeft: 20, marginRight: 20, paddingLeft: 24, paddingRight: 24, paddingTop: 20, paddingBottom: 24}
                              }}/>
        <Animation>
          <LessCodeDiagram width={'100%'} maxHeight={360}/>
        </Animation>
      </AnimationBlock>
      <AnimationBlock>
        <AnimationDescription header={'Use fundamental building blocks.'}
                              description={
                                 'Framework-X lets you build complex software from a few essential pieces.'
                                           + 'Their power comes from the relationships between them and how easy they are to combine. '
                                           }
                              rootCss={{
                                [theme.whenTablet]: {left: 0, marginLeft: 40},
                                [theme.whenMobile]: {marginLeft: 20, marginRight: 20, paddingLeft: 24, paddingRight: 24, paddingTop: 20, paddingBottom: 24}
                              }}/>
        <Animation>
          <Tetris/>
        </Animation>
      </AnimationBlock>
      <ContactUs/>
      <Footer/>
    </Layout>
  )
}

export default IndexPage
