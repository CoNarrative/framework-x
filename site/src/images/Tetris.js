import React from 'react'
import {motion} from 'framer-motion'
import {whenTablet} from '../theme'
import '@lottiefiles/lottie-player'
import {DimensionalBox} from '../components/DimensionalBox'

export const Tetris = ({width, maxHeight}) => (
  <div css={{ display: 'flex', width: '100%', justifyContent: 'center', '& > lottie-player:first-of-type': {marginRight: 32}}}>
    <lottie-player
      autoplay
      loop
      mode="normal"
      speed="1.5"
      src={"https://assets7.lottiefiles.com/packages/lf20_tGrQQh.json"}
      style={{width: width, maxHeight: maxHeight}}
    />
    <lottie-player
      autoplay
      loop
      mode="normal"
      speed="1.5"
      src={"https://assets3.lottiefiles.com/packages/lf20_3Yu8R4.json"}
      style={{width: width, maxHeight: maxHeight}}
    />
  </div>
)
