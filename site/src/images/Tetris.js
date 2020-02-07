import React from 'react'
import '@lottiefiles/lottie-player'
import handleViewport from 'react-in-viewport'
import * as theme from '../theme'

export class TetrisBlock extends React.Component {
  animateOnce = ({inViewport, playerA, playerB}) => {
    if (inViewport) {
      playerA.play()
      playerB.play()
    }
  }

  render() {
    const {width, maxHeight, inViewport, forwardedRef} = this.props
    const playerA = document.getElementById('tetris-fx')
    const playerB = document.getElementById('tetris-other')

    return (
      <div
        ref={forwardedRef}
        style={this.animateOnce({inViewport, playerA, playerB})}
        css={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
          '& > lottie-player:first-of-type': {marginRight: 32},
        }}>
        <lottie-player
          id={'tetris-fx'}
          loop
          mode="normal"
          speed="1.5"
          src={'https://assets7.lottiefiles.com/packages/lf20_tGrQQh.json'}
          style={{ maxWidth: 320, flexGrow: 1 }}
        />
        <lottie-player
          id={'tetris-other'}
          loop
          mode="normal"
          speed="1.5"
          src={'https://assets3.lottiefiles.com/packages/lf20_3Yu8R4.json'}
          style={{ maxWidth: 320, flexGrow: 1 }}
        />
      </div>
    )
  }
}

export const Tetris = handleViewport(TetrisBlock, {}, {disconnectOnLeave: true})
