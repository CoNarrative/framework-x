import React from 'react'
import {motion, useAnimation} from 'framer-motion'
import handleViewport from 'react-in-viewport'
import * as theme from '../theme'

const DefaultInitial = {
  scale: 0,
  pathLength: 0
}

function animateOnce({...props}) {
  if (props.enterCount === 0 && props.inViewport) {
    props.windowControls.start({
      y: -477,
      transition: {duration: 1.2}
    })
    props.filledControls.start({
      scale: 1,
      pathLength: 1,
      transition: {duration: 0.8, delay: 2,}
    })
    props.unfilledControls.start({
      scale: 1,
      pathLength: 1,
      transition: {duration: 0.8, delay: 1.2,}
    })
    props.line1Controls.start({
      strokeDashoffset: 160,
      transition: {duration: 1, ease: 'linear', delay: 3.2}
    })
    props.line2Controls.start({
      strokeDashoffset: 46,
      transition: {duration: 1.6, ease: 'linear', delay: 4.2}
    })
    props.line3Controls.start({
      strokeDashoffset: 0,
      transition: {duration: 0.6, ease: 'linear', delay: 5.8}
    })
    props.line4Controls.start({
      strokeDashoffset: 110,
      transition: {duration: 2.2, ease: 'linear', delay: 5.8,}
    })
    props.line5Controls.start({
      strokeDashoffset: 0,
      transition: {duration: 2.4, ease: 'linear', delay: 8}
    })
    props.line6Controls.start({
      strokeDashoffset: 0,
      transition: {duration: 2.4, ease: 'linear', delay: 10.4,}
    })
  }
}

function TreeDiagramBlock({width, minWidth, maxHeight, forwardedRef, inViewport, enterCount}) {
  const windowControls = useAnimation()
  const filledControls = useAnimation()
  const unfilledControls = useAnimation()
  const line1Controls = useAnimation()
  const line2Controls = useAnimation()
  const line3Controls = useAnimation()
  const line4Controls = useAnimation()
  const line5Controls = useAnimation()
  const line6Controls = useAnimation()

  return (
    <svg
      viewBox="0 0 666.6 189"
      css={{
        width: width,
        minWidth: minWidth,
        maxHeight: maxHeight,
        marginRight: -140,
        [theme.whenTablet]: {
          marginRight: -100,
        },
        [theme.whenMobile]: {
          marginRight: -64,
          width: '120%',
        }
      }}
      ref={forwardedRef}
      style={animateOnce({
        inViewport,
        enterCount,
        windowControls,
        filledControls,
        unfilledControls,
        line1Controls,
        line2Controls,
        line3Controls,
        line4Controls,
        line5Controls,
        line6Controls,
      })}>
      <motion.g initial={DefaultInitial} animate={filledControls} style={{x: 6750, y: 3062}}
                id="filled-tri-01">
        <g id="Rectangle_Copy_2" transform="translate(343 478)">
          <path fill="#2DCD8C" d="M-6786.5-3351.5h-17.4l-3.2-2.6l8.5-15.1l5.5,4.5L-6786.5-3351.5z"/>
          <path fill="#141515" d="M-6798.4-3368.4l-7.9,14.1l2.7,2.2h16.3l-6.1-12.4L-6798.4-3368.4 M-6798.6-3370l6,5l7,14h-18.4l-3.6-3
			L-6798.6-3370z"/>
        </g>
        <path id="Path_890" fill="none" stroke="#000000" strokeMiterlimit="10" d="M-6448.6-2876.7l4.7,3.1"/>
        <g id="Rectangle_Copy_4" transform="translate(343 478)">
          <path fill="#38E49E" d="M-6791.4-3354.5h-15.3l8.1-14.4L-6791.4-3354.5z"/>
          <path fill="#141515"
                d="M-6798.7-3367.9l-7.2,12.9h13.7L-6798.7-3367.9 M-6798.6-3370l8,16h-17L-6798.6-3370z"/>
        </g>
      </motion.g>
      <motion.g initial={DefaultInitial} animate={unfilledControls}               style={{x: 6680, y: 2953}} id="white-sq-02">
        <g id="Rectangle_Copy_2-2" transform="translate(343 478)">
          <path fill="#E4E6EC"
                d="M-6809-3350.5h-16.7l-3.2-3.6l6.4-11.5l9.9-3.8l3.6,3.6L-6809-3350.5L-6809-3350.5z"/>
          <path fill="#141515" d="M-6812.7-3368.8l-9.4,3.6l-6.1,11.1l2.8,3.1h15.9v-14.6L-6812.7-3368.8 M-6812.5-3370l4,4v16h-17.4l-3.6-4
			l6.6-12L-6812.5-3370z"/>
        </g>
        <path id="Path_890-2" fill="none" stroke="#141515" d="M-6470.3-2876.9l4.4,4.2"/>
        <g id="Rectangle_Copy_4-2" transform="translate(343 478)">
          <rect x="-6829.5" y="-3370" fill="#FFFFFF" width="17" height="16"/>
          <rect x="-6829" y="-3369.5" fill="none" stroke="#141515" strokeMiterlimit="10" width="16" height="15"/>
        </g>
      </motion.g>
      <motion.g initial={DefaultInitial} animate={unfilledControls}
                style={{x: 6680, y: 2953}} id="white-sq-01">
        <g id="Rectangle_Copy_2-2_1_" transform="translate(343 478)">
          <path fill="#E4E6EC"
                d="M-6906-3350.5h-16.7l-3.2-3.6l6.4-11.5l9.9-3.8l3.6,3.6L-6906-3350.5L-6906-3350.5z"/>
          <path fill="#141515" d="M-6909.7-3368.8l-9.4,3.6l-6.1,11.1l2.8,3.1h15.9v-14.6L-6909.7-3368.8 M-6909.5-3370l4,4v16h-17.4l-3.6-4
			l6.6-12L-6909.5-3370z"/>
        </g>
        <path id="Path_890-2_1_" fill="none" stroke="#141515" d="M-6567.3-2876.9l4.4,4.2"/>
        <g id="Rectangle_Copy_4-2_1_" transform="translate(343 478)">
          <rect x="-6926.5" y="-3370" fill="#FFFFFF" width="17" height="16"/>
          <rect x="-6926" y="-3369.5" fill="none" stroke="#141515" strokeMiterlimit="10" width="16" height="15"/>
        </g>
      </motion.g>
      <motion.g initial={DefaultInitial} animate={unfilledControls}
                style={{x: 6737, y: 2916}} id="white-sq-03">
        <g id="Rectangle_Copy_2-3" transform="translate(343 478)">
          <path fill="#E4E6EC"
                d="M-6773.1-3374.5h-16.7l-3.2-3.6l6.4-11.5l9.9-3.8l3.6,3.6L-6773.1-3374.5L-6773.1-3374.5z"/>
          <path fill="#141515" d="M-6776.9-3392.8l-9.4,3.6l-6.1,11.1l2.8,3.1h15.9v-14.6L-6776.9-3392.8 M-6776.6-3394l4,4v16h-17.4l-3.6-4
			l6.6-12L-6776.6-3394z"/>
        </g>
        <path id="Path_890-3" fill="none" stroke="#141515" d="M-6434.4-2900.9l4.4,4.2"/>
        <g id="Rectangle_Copy_4-3" transform="translate(343 478)">
          <rect x="-6793.6" y="-3394" fill="#FFFFFF" width="17" height="16"/>
          <rect x="-6793.1" y="-3393.5" fill="none" stroke="#141515" strokeMiterlimit="10" width="16" height="15"/>
        </g>
      </motion.g>
      <motion.g initial={DefaultInitial} animate={filledControls}
                style={{x: 6737, y: 2991}} id="filled-sq-02" transform="translate(6737 2991)">
        <g id="Rectangle_Copy_2-4" transform="translate(343 478)">
          <path fill="#2DCD8C"
                d="M-6773.1-3388.5h-16.7l-3.2-3.6l6.4-11.5l9.9-3.8l3.6,3.6L-6773.1-3388.5L-6773.1-3388.5z"/>
          <path fill="#141515" d="M-6776.9-3406.8l-9.4,3.6l-6.1,11.1l2.8,3.1h15.9v-14.6L-6776.9-3406.8 M-6776.6-3408l4,4v16h-17.4l-3.6-4
			l6.6-12L-6776.6-3408z"/>
        </g>
        <path id="Path_890-4" fill="none" stroke="#141515" d="M-6434.4-2914.9l4.4,4.2"/>
        <g id="Rectangle_Copy_4-4" transform="translate(343 478)">
          <rect x="-6793.6" y="-3408" fill="#38E49E" width="17" height="16"/>
          <rect x="-6793.1" y="-3407.5" fill="none" stroke="#141515" strokeMiterlimit="10" width="16" height="15"/>
        </g>
      </motion.g>
      <motion.g initial={DefaultInitial} animate={filledControls}
                style={{x: 6583, y: 3014}} id="filled-sq-01" transform="translate(6583 3014)">
        <g id="Rectangle_Copy_2-5" transform="translate(343 478)">
          <path fill="#2DCD8C"
                d="M-6809-3350.5h-16.7l-3.2-3.6l6.4-11.5l9.9-3.8l3.6,3.6L-6809-3350.5L-6809-3350.5z"/>
          <path fill="#141515" d="M-6812.7-3368.8l-9.4,3.6l-6.1,11.1l2.8,3.1h15.9v-14.6L-6812.7-3368.8 M-6812.5-3370l4,4v16h-17.4l-3.6-4
			l6.6-12L-6812.5-3370z"/>
        </g>
        <path id="Path_890-5" fill="none" stroke="#141515" d="M-6470.3-2876.9l4.4,4.2"/>
        <g id="Rectangle_Copy_4-5" transform="translate(343 478)">
          <rect x="-6829.5" y="-3370" fill="#38E49E" width="17" height="16"/>
          <rect x="-6829" y="-3369.5" fill="none" stroke="#141515" strokeMiterlimit="10" width="16" height="15"/>
        </g>
      </motion.g>
      <motion.path initial={DefaultInitial} animate={unfilledControls} id="Path_5808"
                   fill="none" stroke="#141515" d="M34.5,70.5h48"/>
      <motion.path initial={DefaultInitial} animate={unfilledControls} id="Path_5833"
                   fill="none" stroke="#141515" d="M131.5,70.5h48"/>
      <motion.path initial={{strokeDashoffset: -50}}
                   style={{strokeDasharray: '6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 280',}}
                   animate={line3Controls} id="Path_5833_1_"
                   fill="none" stroke="#38E49E" strokeWidth="2" strokeDasharray="6,4" d="M228.4,70.5h48"/>
      <motion.g initial={DefaultInitial} animate={unfilledControls}
                style={{x: 6583, y: 2892}} id="white-tri-01">
        <g id="Rectangle_Copy_2-6" transform="translate(343 478)">
          <path fill="#E4E6EC" d="M-6808.3-3351.5h-17.4l-3.2-2.6l8.5-15.1l5.5,4.5L-6808.3-3351.5z"/>
          <path fill="#141515" d="M-6820.3-3368.4l-7.9,14.1l2.7,2.2h16.3l-6.1-12.4L-6820.3-3368.4 M-6820.5-3370l6,5l7,14h-18.4l-3.6-3
			L-6820.5-3370z"/>
        </g>
        <path id="Path_890-6" fill="none" stroke="#000000" strokeMiterlimit="10" d="M-6470.5-2876.7l4.7,3.1"/>
        <g id="Rectangle_Copy_4-6" transform="translate(343 478)">
          <path fill="#FFFFFF" d="M-6813.3-3354.5h-15.3l8.1-14.4L-6813.3-3354.5z"/>
          <path fill="#141515"
                d="M-6820.6-3367.9l-7.2,12.9h13.7L-6820.6-3367.9 M-6820.5-3370l8,16h-17L-6820.5-3370z"/>
        </g>
      </motion.g>
      <motion.g initial={DefaultInitial} animate={unfilledControls}
                id="filled-cir-01">
        <g id="Group_4608">
          <path id="Union_11" fill="#E4E6EC" stroke="#141515" strokeLinejoin="round" d="M9.6,82.3l-4.2-2.7L9.6,82.3
			c-0.7-0.5-1.3-1.1-1.9-1.7c-5.3-1.5-8.4-7.1-6.8-12.4s7.1-8.4,12.4-6.8c1.7,0.5,3.2,1.4,4.4,2.6l3.4,3.2c4,3.4,4.6,9.4,1.2,13.4
			C19.2,84.4,13.7,85.1,9.6,82.3z M21.1,67.2L17.7,64c0.6,0.6,1.1,1.2,1.5,1.9C19.8,66.3,20.5,66.7,21.1,67.2z"/>
        </g>
        <circle id="Ellipse_12" fill="#FFFFFF" stroke="#141515" strokeLinejoin="round" cx="10.5" cy="71" r="10"/>
      </motion.g>
      <motion.path initial={{strokeDashoffset: 284}}
                   style={{strokeDasharray: '6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 284',}}
                   animate={line1Controls} id="cir_x5F_to_x5F_filled-sq-01" fill="none" stroke="#38E49E"
                   strokeWidth="2" strokeDasharray="6,4" d="M34.5,91
	34.5,131 82.5,131 "/>
      <motion.path initial={{strokeDashoffset: -351}}
                   style={{strokeDasharray: '6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 379',}}
                   animate={line6Controls} id="cir_x5F_to_x5F_filled-tri" fill="none" stroke="#38E49E"
                   strokeWidth="2" strokeDasharray="6,4"
                   d="M13,91
	13,179 276.4,179 "/>
      <motion.path initial={DefaultInitial} animate={unfilledControls}
                   id="_x3C_Path_x3E_"
                   fill="none" stroke="#141515" d="M34.5,50 34.5,10 82.5,10 "/>
      <motion.path initial={DefaultInitial} animate={unfilledControls} fill="none"
                   stroke="#141515" d="M200.5,50 200.5,10 276.4,10 "/>
      <motion.path initial={{strokeDashoffset: 246}}
                   style={{strokeDasharray: '6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 246',}}
                   animate={line2Controls} id="filled-sq01__x3E__filled-sq-02" fill="none" stroke="#38E49E"
                   strokeWidth="2" strokeDasharray="6,4" d="
	M131.3,131 294.9,131 294.9,95 "/>
      <motion.g initial={{y: -342}} animate={windowControls} style={{x: -342, y: -477}}
                id="window" transform="translate(-342.672 -477.938)">
        <g id="Rectangle_Copy_2_1_" transform="translate(343 478)">
          <path fill="#FFFFFF" d="M566,169.5H381.7l-3.5-3.1L382,21.7l180.7-2.3l3.4,3.1V169.5z"/>
          <path fill="#141515" d="M562.5,19.9l-180.2,2.2l-3.7,144l3.2,2.9h183.8V22.7L562.5,19.9 M562.9,18.9l3.6,3.4V170h-185l-3.7-3.4
			l3.7-145.4L562.9,18.9z"/>
        </g>
        <path id="Path_890_1_" fill="none" stroke="#141515" d="M905.5,644.2l3.8,3.5"/>
        <g id="Rectangle_Copy_4_1_" transform="translate(342.672 477.938)">
          <rect x="377.8" y="18.9" fill="#FFFFFF" width="184.7" height="147.4"/>
          <rect x="378.3" y="19.4" fill="none" stroke="#141515" strokeMiterlimit="10" width="183.8" height="146.5"/>
        </g>
        <path id="Path_5829" fill="#E4E6EB" d="M721.8,508.1h182.5v16H721.8V508.1z"/>
        <path id="Path_5840" fill="#E4E6EB" d="M789.3,557.4h100.8v23.1H789.3V557.4z"/>
        <path id="Path_5841" fill="#E4E6EB" d="M789.3,589.1h61.9v47.6h-61.9V589.1z"/>
        <path id="Path_5842" fill="#E4E6EB" d="M863.6,589.1h26v47.6h-25.9L863.6,589.1L863.6,589.1z"/>
        <path id="Path_5832" fill="#E4E6EB" d="M735.2,532.8h44.9v103.7h-44.9V532.8z"/>
        <path id="active-box" fill="#38E49E" d="M789.3,532.8h100.8v15.9H789.3V532.8z"/>
        <rect id="Rectangle_58" x="720.4" y="496.9" fill="#141515" width="184.7" height="11.2"/>
        <path id="Path_5817" fill="#FFFFFF" d="M727.5,500.4c1.2,0,2.2,1,2.2,2.2c0,1.2-1,2.2-2.2,2.2c-1.2,0-2.2-1-2.2-2.2l0,0
		C725.2,501.3,726.3,500.4,727.5,500.4z"/>
        <path id="Path_5816" fill="#FFFFFF" d="M734.3,500.4c1.2,0,2.2,1,2.2,2.2c0,1.2-1,2.2-2.2,2.2c-1.2,0-2.2-1-2.2-2.2l0,0
		C732.1,501.3,733,500.4,734.3,500.4z"/>
        <path id="Path_5815" fill="#FFFFFF" d="M741,500.4c1.2,0,2.2,1,2.2,2.2c0,1.2-1,2.2-2.2,2.2c-1.2,0-2.2-1-2.2-2.2l0,0
		C738.8,501.3,739.8,500.4,741,500.4z"/>
        <path id="Path_5814" fill="#FFFFFF" d="M793.7,504.9h0.6V503h1.9v-0.5h-1.9V501h2.1v-0.5h-2.6L793.7,504.9z M797.4,504.9h2.9v-0.5
		h-1.4v-1.1c0-0.7,0.3-1.1,0.8-1.1h0.6v-0.5h-0.6c-0.4,0-0.7,0.2-0.8,0.6l0,0v-0.6h-1.3v0.5h0.8v2.3h-0.9L797.4,504.9z M802.3,504.9
		c0.4,0,0.7-0.2,1-0.5l0,0v0.5h0.5v-2.1c0-0.7-0.5-1.1-1.1-1.1h-0.1c-0.6-0.1-1.1,0.4-1.2,0.9v0.1h0.5c0-0.3,0.3-0.6,0.7-0.6
		c0.4-0.1,0.7,0.2,0.7,0.6v0.1v0.2h-0.7c-0.9,0-1.3,0.5-1.3,1S801.7,504.9,802.3,504.9C802.2,504.9,802.3,504.9,802.3,504.9
		L802.3,504.9z M802.4,504.5c-0.5,0-0.7-0.3-0.7-0.6c0-0.4,0.3-0.6,0.7-0.6h0.7v0.3C803.3,504.1,803,504.5,802.4,504.5L802.4,504.5
		L802.4,504.5z M807.1,501.6c-0.3,0-0.6,0.2-0.6,0.6l0,0c0-0.3-0.3-0.6-0.6-0.6l0,0c-0.3,0-0.6,0.2-0.6,0.6l0,0v-0.5H805v3.2h0.5
		v-2.1c0-0.5,0.2-0.7,0.4-0.7c0.3,0,0.4,0.2,0.4,0.6v2.2h0.5v-2.1c0-0.5,0.1-0.7,0.4-0.7c0.3,0,0.3,0.3,0.3,0.5v2.3h0.5v-2.2
		C807.7,502.1,807.6,501.6,807.1,501.6L807.1,501.6z M810.1,504.9c0.7,0.1,1.2-0.4,1.3-0.9h-0.6c-0.1,0.4-0.5,0.6-0.8,0.5
		c-0.6,0-0.9-0.4-0.9-1h2.2v-0.3c0.1-0.7-0.5-1.4-1.2-1.5c-0.1,0-0.1,0-0.2,0c-0.9,0-1.4,0.7-1.4,1.7c-0.1,0.8,0.5,1.5,1.2,1.6
		C809.9,504.9,810,504.9,810.1,504.9L810.1,504.9z M809.1,503c0-0.5,0.3-0.8,0.7-0.9h0.1c0.5,0,0.8,0.3,0.8,0.7v0.1L809.1,503
		L809.1,503z M812.7,504.9h0.6l0.5-2.4l0,0l0.5,2.4h0.7l0.5-3.1v-0.1h-0.5l-0.3,2.4l0,0l-0.5-2.4h-0.6l-0.5,2.4l0,0l-0.3-2.4h-0.6
		v0.1L812.7,504.9z M817.5,504.9c1,0,1.4-0.7,1.4-1.7c0-0.9-0.5-1.7-1.4-1.7c-0.9,0-1.4,0.7-1.4,1.7
		C816.1,504.1,816.5,504.9,817.5,504.9L817.5,504.9z M817.5,504.4c-0.7,0-0.9-0.5-0.9-1.2c0-0.7,0.3-1.2,0.9-1.2
		c0.7,0,0.9,0.5,0.9,1.2C818.4,503.9,818.1,504.4,817.5,504.4L817.5,504.4z M819.8,504.9h2.9v-0.5h-1.4v-1.1c0-0.7,0.3-1.1,0.8-1.1
		h0.6v-0.5h-0.6c-0.4,0-0.7,0.2-0.8,0.6l0,0v-0.6h-1.3v0.5h0.8v2.3h-0.9L819.8,504.9z M823.7,500.3v4.6h0.6v-4.6H823.7z
		 M824.9,503.1l1.3-1.3v-0.1h-0.7l-1.3,1.4l1.4,1.8h0.6v-0.1L824.9,503.1z M827.8,503.3h1.9v-0.5h-1.9V503.3z M831,504.9h0.6
		l0.9-1.8l0,0l0.9,1.8h0.6v-0.1l-1.1-2.1l0,0l1-2.1v-0.1h-0.6l-0.9,1.8l0,0l-0.8-1.8H831v0.1l1.1,2.1l0,0L831,504.9L831,504.9z"/>
      </motion.g>
      <motion.path initial={{strokeDashoffset: 337}}
                   style={{strokeDasharray: '6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 337',}}
                   animate={line4Controls} id="newPath" fill="none" stroke="#38E49E" strokeWidth="2"
                   d="M319.7,70.5 351.7,70.5 351.7,38.6 499.8,38.6 499.8,54.5 "/>
      <motion.path initial={{strokeDashoffset: -295}}
                   style={{strokeDasharray: '6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 6 369',}}
                   animate={line5Controls} id="newPath1" fill="none" stroke="#38E49E" strokeWidth="2"
                   strokeDasharray="6,4" d="M319.7,178.6 500.1,178.6 500.1,64.5 "/>
    </svg>
  )
}

export const TreeDiagram = handleViewport(TreeDiagramBlock, {}, {disconnectOnLeave: true})
