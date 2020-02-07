import React from 'react'
import handleViewport from 'react-in-viewport'
import lottie from 'lottie-web/build/player/lottie'
import * as theme from '../theme'

export class TetrisBlock extends React.Component {
  constructor(props) {
    super(props)
  }

  animateOnce = ({inViewport, enterCount}) => {
    if (enterCount === 0 && inViewport) {
      lottie.play()
    }
  }

  componentDidMount() {
    let tetrisFX = document.getElementById('tetris-fx')
    let tetrisOther = document.getElementById('tetris-other')

    lottie.loadAnimation({
      container: tetrisFX,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'https://assets7.lottiefiles.com/packages/lf20_tGrQQh.json'
    })
    lottie.loadAnimation({
      container: tetrisOther,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: 'https://assets3.lottiefiles.com/packages/lf20_3Yu8R4.json'
    })
  }

  render() {
    const {width, maxHeight, inViewport, forwardedRef, enterCount} = this.props

    return (
      <div
        ref={forwardedRef}
        style={this.animateOnce({inViewport, enterCount})}
        css={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          '& > div:first-of-type': {marginRight: 64},
        }}>
        <div id={'tetris-fx'} css={{flexGrow: 1, maxWidth: 320}}/>
        <div id={'tetris-other'} css={{flexGrow: 1, maxWidth: 320}}/>
      </div>
    )
  }
}

export const Tetris = handleViewport(TetrisBlock, {}, {disconnectOnLeave: true})
