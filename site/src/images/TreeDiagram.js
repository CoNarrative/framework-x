import React from 'react'
import {motion} from "framer-motion"
import {whenTablet} from "../theme";

const DefaultInitial = {
  scale: 0,
  pathLength: 0
}

const DefaultAnimate = {
  scale: 1,
  pathLength: 1
}

const UnfilledTransition = {
  duration: 0.8,
  delay: 1.2,
}

export const TreeDiagram = () => (
  <svg
    css={{
      width: '420px',
      minWidth: 600,
      maxHeight: 360,
      marginLeft: 80,
      [whenTablet]: {marginLeft: 0, marginBottom: 64, width: '70%', minWidth: 280}
    }}
    version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px"
    y="0px"
    viewBox="0 0 666.6 189" enable-background="new 0 0 666.6 189" xmlSpace="preserve">
    <g id="filled-tri-01" transform="translate(6750 3062)">
      <g id="Rectangle_Copy_2" transform="translate(343 478)">
        <path fill="#2DCD8C" d="M-6786.5-3351.5h-17.4l-3.2-2.6l8.5-15.1l5.5,4.5L-6786.5-3351.5z"/>
        <path fill="#141515" d="M-6798.4-3368.4l-7.9,14.1l2.7,2.2h16.3l-6.1-12.4L-6798.4-3368.4 M-6798.6-3370l6,5l7,14h-18.4l-3.6-3
			L-6798.6-3370z"/>
      </g>
      <path id="Path_890" fill="none" stroke="#000000" stroke-miterlimit="10" d="M-6448.6-2876.7l4.7,3.1"/>
      <g id="Rectangle_Copy_4" transform="translate(343 478)">
        <path fill="#38E49E" d="M-6791.4-3354.5h-15.3l8.1-14.4L-6791.4-3354.5z"/>
        <path fill="#141515" d="M-6798.7-3367.9l-7.2,12.9h13.7L-6798.7-3367.9 M-6798.6-3370l8,16h-17L-6798.6-3370z"/>
      </g>
    </g>
    <motion.g initial={DefaultInitial} animate={DefaultAnimate} transition={UnfilledTransition} style={{ x: 6680, y: 2953}} id="white-sq-02" >
      <g id="Rectangle_Copy_2-2" transform="translate(343 478)">
        <path fill="#E4E6EC" d="M-6809-3350.5h-16.7l-3.2-3.6l6.4-11.5l9.9-3.8l3.6,3.6L-6809-3350.5L-6809-3350.5z"/>
        <path fill="#141515" d="M-6812.7-3368.8l-9.4,3.6l-6.1,11.1l2.8,3.1h15.9v-14.6L-6812.7-3368.8 M-6812.5-3370l4,4v16h-17.4l-3.6-4
			l6.6-12L-6812.5-3370z"/>
      </g>
      <path id="Path_890-2" fill="none" stroke="#141515" d="M-6470.3-2876.9l4.4,4.2"/>
      <g id="Rectangle_Copy_4-2" transform="translate(343 478)">
        <rect x="-6829.5" y="-3370" fill="#FFFFFF" width="17" height="16"/>
        <rect x="-6829" y="-3369.5" fill="none" stroke="#141515" stroke-miterlimit="10" width="16" height="15"/>
      </g>
    </motion.g>
    <motion.g initial={DefaultInitial} animate={DefaultAnimate} transition={UnfilledTransition} style={{ x: 6680, y: 2953}} id="white-sq-01">
      <g id="Rectangle_Copy_2-2_1_" transform="translate(343 478)">
        <path fill="#E4E6EC" d="M-6906-3350.5h-16.7l-3.2-3.6l6.4-11.5l9.9-3.8l3.6,3.6L-6906-3350.5L-6906-3350.5z"/>
        <path fill="#141515" d="M-6909.7-3368.8l-9.4,3.6l-6.1,11.1l2.8,3.1h15.9v-14.6L-6909.7-3368.8 M-6909.5-3370l4,4v16h-17.4l-3.6-4
			l6.6-12L-6909.5-3370z"/>
      </g>
      <path id="Path_890-2_1_" fill="none" stroke="#141515" d="M-6567.3-2876.9l4.4,4.2"/>
      <g id="Rectangle_Copy_4-2_1_" transform="translate(343 478)">
        <rect x="-6926.5" y="-3370" fill="#FFFFFF" width="17" height="16"/>
        <rect x="-6926" y="-3369.5" fill="none" stroke="#141515" stroke-miterlimit="10" width="16" height="15"/>
      </g>
    </motion.g>
    <motion.g initial={DefaultInitial} animate={DefaultAnimate} transition={UnfilledTransition} style={{ x: 6737, y: 2916}} id="white-sq-03">
      <g id="Rectangle_Copy_2-3" transform="translate(343 478)">
        <path fill="#E4E6EC"
              d="M-6773.1-3374.5h-16.7l-3.2-3.6l6.4-11.5l9.9-3.8l3.6,3.6L-6773.1-3374.5L-6773.1-3374.5z"/>
        <path fill="#141515" d="M-6776.9-3392.8l-9.4,3.6l-6.1,11.1l2.8,3.1h15.9v-14.6L-6776.9-3392.8 M-6776.6-3394l4,4v16h-17.4l-3.6-4
			l6.6-12L-6776.6-3394z"/>
      </g>
      <path id="Path_890-3" fill="none" stroke="#141515" d="M-6434.4-2900.9l4.4,4.2"/>
      <g id="Rectangle_Copy_4-3" transform="translate(343 478)">
        <rect x="-6793.6" y="-3394" fill="#FFFFFF" width="17" height="16"/>
        <rect x="-6793.1" y="-3393.5" fill="none" stroke="#141515" stroke-miterlimit="10" width="16" height="15"/>
      </g>
    </motion.g>
    <motion.g initial={DefaultInitial} animate={DefaultAnimate} transition={{duration: 0.8, delay: 6.4}} style={{ x: 6737, y: 2991 }} id="filled-sq-02" transform="translate(6737 2991)">
      <g id="Rectangle_Copy_2-4" transform="translate(343 478)">
        <path fill="#2DCD8C"
              d="M-6773.1-3388.5h-16.7l-3.2-3.6l6.4-11.5l9.9-3.8l3.6,3.6L-6773.1-3388.5L-6773.1-3388.5z"/>
        <path fill="#141515" d="M-6776.9-3406.8l-9.4,3.6l-6.1,11.1l2.8,3.1h15.9v-14.6L-6776.9-3406.8 M-6776.6-3408l4,4v16h-17.4l-3.6-4
			l6.6-12L-6776.6-3408z"/>
      </g>
      <path id="Path_890-4" fill="none" stroke="#141515" d="M-6434.4-2914.9l4.4,4.2"/>
      <g id="Rectangle_Copy_4-4" transform="translate(343 478)">
        <rect x="-6793.6" y="-3408" fill="#38E49E" width="17" height="16"/>
        <rect x="-6793.1" y="-3407.5" fill="none" stroke="#141515" stroke-miterlimit="10" width="16" height="15"/>
      </g>
    </motion.g>
    <motion.g initial={DefaultInitial} animate={DefaultAnimate} transition={{duration: 0.8, delay: 4}} style={{x: 6583, y: 3014}} id="filled-sq-01" transform="translate(6583 3014)">
      <g id="Rectangle_Copy_2-5" transform="translate(343 478)">
        <path fill="#2DCD8C" d="M-6809-3350.5h-16.7l-3.2-3.6l6.4-11.5l9.9-3.8l3.6,3.6L-6809-3350.5L-6809-3350.5z"/>
        <path fill="#141515" d="M-6812.7-3368.8l-9.4,3.6l-6.1,11.1l2.8,3.1h15.9v-14.6L-6812.7-3368.8 M-6812.5-3370l4,4v16h-17.4l-3.6-4
			l6.6-12L-6812.5-3370z"/>
      </g>
      <path id="Path_890-5" fill="none" stroke="#141515" d="M-6470.3-2876.9l4.4,4.2"/>
      <g id="Rectangle_Copy_4-5" transform="translate(343 478)">
        <rect x="-6829.5" y="-3370" fill="#38E49E" width="17" height="16"/>
        <rect x="-6829" y="-3369.5" fill="none" stroke="#141515" stroke-miterlimit="10" width="16" height="15"/>
      </g>
    </motion.g>
    <motion.path initial={DefaultInitial} animate={DefaultAnimate} transition={UnfilledTransition} id="Path_5808" fill="none" stroke="#141515" d="M34.5,70.5h48"/>
    <motion.path initial={DefaultInitial} animate={DefaultAnimate} transition={UnfilledTransition} id="Path_5833" fill="none" stroke="#141515" d="M131.5,70.5h48"/>
    <motion.path initial={DefaultInitial} animate={DefaultAnimate} transition={UnfilledTransition} id="Path_5833_1_" fill="none" stroke="#141515" d="M228.4,70.5h48"/>
    <motion.g initial={DefaultInitial} animate={DefaultAnimate} transition={UnfilledTransition} style={{ x: 6583, y: 2892}} id="white-tri-01">
      <g id="Rectangle_Copy_2-6" transform="translate(343 478)">
        <path fill="#E4E6EC" d="M-6808.3-3351.5h-17.4l-3.2-2.6l8.5-15.1l5.5,4.5L-6808.3-3351.5z"/>
        <path fill="#141515" d="M-6820.3-3368.4l-7.9,14.1l2.7,2.2h16.3l-6.1-12.4L-6820.3-3368.4 M-6820.5-3370l6,5l7,14h-18.4l-3.6-3
			L-6820.5-3370z"/>
      </g>
      <path id="Path_890-6" fill="none" stroke="#000000" stroke-miterlimit="10" d="M-6470.5-2876.7l4.7,3.1"/>
      <g id="Rectangle_Copy_4-6" transform="translate(343 478)">
        <path fill="#FFFFFF" d="M-6813.3-3354.5h-15.3l8.1-14.4L-6813.3-3354.5z"/>
        <path fill="#141515" d="M-6820.6-3367.9l-7.2,12.9h13.7L-6820.6-3367.9 M-6820.5-3370l8,16h-17L-6820.5-3370z"/>
      </g>
    </motion.g>
    <motion.g initial={DefaultInitial} animate={DefaultAnimate} transition={UnfilledTransition} id="filled-cir-01">
      <g id="Group_4608">
        <path id="Union_11" fill="#E4E6EC" stroke="#141515" stroke-linejoin="round" d="M9.6,82.3l-4.2-2.7L9.6,82.3
			c-0.7-0.5-1.3-1.1-1.9-1.7c-5.3-1.5-8.4-7.1-6.8-12.4s7.1-8.4,12.4-6.8c1.7,0.5,3.2,1.4,4.4,2.6l3.4,3.2c4,3.4,4.6,9.4,1.2,13.4
			C19.2,84.4,13.7,85.1,9.6,82.3z M21.1,67.2L17.7,64c0.6,0.6,1.1,1.2,1.5,1.9C19.8,66.3,20.5,66.7,21.1,67.2z"/>
      </g>
      <circle id="Ellipse_12" fill="#FFFFFF" stroke="#141515" stroke-linejoin="round" cx="10.5" cy="71" r="10"/>
    </motion.g>
    <path id="cir_x5F_to_x5F_filled-sq-01" fill="none" stroke="#38E49E" strokeWidth="2" strokeDasharray="6,4" d="M34.5,91
	34.5,131 82.5,131 "/>
    <motion.path id="cir_x5F_to_x5F_filled-sq-01" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6,4" d="M34.5,91
	34.5,131 82.5,131 " transition={{duration: 1.6, delay: 2.4}} initial={{pathLength: 1, pathOffset: 0}} animate={{pathLength: 0, pathOffset: 1}}/>
    <polyline id="cir_x5F_to_x5F_filled-tri" fill="none" stroke="#38E49E" stroke-width="2" stroke-dasharray="6,4" points="13,91
	13,179 276.4,179 "/>
    <motion.path initial={DefaultInitial} animate={DefaultAnimate} transition={UnfilledTransition} id="_x3C_Path_x3E_" fill="none" stroke="#141515" d="M34.5,50 34.5,10 82.5,10 "/>
    <motion.path initial={DefaultInitial} animate={DefaultAnimate} transition={UnfilledTransition} fill="none" stroke="#141515" d="M200.5,50 200.5,10 276.4,10 "/>
    <path id="filled-sq01__x3E__filled-sq-02" fill="none" stroke="#38E49E" stroke-width="2" stroke-dasharray="6,4" d="
	M131.3,131 294.9,131 294.9,95 "/>
	<motion.path id="filled-sq01__x3E__filled-sq-02" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="6,4" d="
	M131.3,131 294.9,131 294.9,95 " transition={{duration: 1.6, delay: 4.8}} initial={{pathLength: 1, pathOffset: 0}} animate={{pathLength: 0, pathOffset: 1}}/>
    <motion.g initial={{ y: -420 }} animate={{y: -477}} transition={{duration: 1.2}} style={{ x: -342, y: -477}} id="window" transform="translate(-342.672 -477.938)">
      <g id="Rectangle_Copy_2_1_" transform="translate(343 478)">
        <path fill="#FFFFFF" d="M572.8,174.9H375.2l-3.7-3.3l4-155.1L569.2,14l3.6,3.3V174.9z"/>
        <path fill="#141515" d="M569,14.5l-193.1,2.4l-4,154.4l3.4,3.1h197V17.6L569,14.5 M569.4,13.5l3.9,3.6v158.3H375l-4-3.6L375,16
			L569.4,13.5z"/>
      </g>
      <path id="Path_890_1_" fill="none" stroke="#141515" d="M912,649.4l4.1,3.7"/>
      <g id="Rectangle_Copy_4_1_" transform="translate(342.672 477.938)">
        <rect x="371" y="13.5" fill="#FFFFFF" width="198" height="158"/>
        <rect x="371.5" y="14" fill="none" stroke="#141515" stroke-miterlimit="10" width="197" height="157"/>
      </g>
      <path id="Path_5829" fill="#E4E6EB" d="M715.1,503.5h195.6v17.1H715.1V503.5z"/>
      <path id="Path_5840" fill="#E4E6EB" d="M787.5,556.3h108v24.8h-108V556.3z"/>
      <path id="Path_5841" fill="#E4E6EB" d="M787.5,590.3h66.3v51h-66.3V590.3z"/>
      <path id="Path_5842" fill="#E4E6EB" d="M867.1,590.3H895v51h-27.8v-51H867.1z"/>
      <path id="Path_5832" fill="#E4E6EB" d="M729.5,530h48.1v111.2h-48.1V530z"/>
      <path id="active-box" fill="#38E49E" d="M787.5,530h108v17h-108V530z"/>
      <rect id="Rectangle_58" x="713.6" y="491.5" fill="#141515" width="198" height="12"/>
      <path id="Path_5817" fill="#FFFFFF" d="M721.2,495.2c1.3,0,2.4,1.1,2.4,2.4s-1.1,2.4-2.4,2.4c-1.3,0-2.4-1.1-2.4-2.4l0,0
		C718.8,496.2,719.9,495.2,721.2,495.2z"/>
      <path id="Path_5816" fill="#FFFFFF" d="M728.5,495.2c1.3,0,2.4,1.1,2.4,2.4s-1.1,2.4-2.4,2.4c-1.3,0-2.4-1.1-2.4-2.4l0,0
		C726.1,496.2,727.1,495.2,728.5,495.2z"/>
      <path id="Path_5815" fill="#FFFFFF" d="M735.7,495.2c1.3,0,2.4,1.1,2.4,2.4s-1.1,2.4-2.4,2.4c-1.3,0-2.4-1.1-2.4-2.4l0,0
		C733.3,496.2,734.4,495.2,735.7,495.2z"/>
      <path id="Path_5814" fill="#FFFFFF" d="M792.2,500h0.6v-2h2v-0.5h-2v-1.6h2.3v-0.5h-2.8L792.2,500z M796.1,500h3.1v-0.5h-1.5v-1.2
		c0-0.8,0.3-1.2,0.9-1.2h0.6v-0.5h-0.6c-0.4,0-0.8,0.2-0.9,0.6l0,0v-0.6h-1.4v0.5h0.9v2.5h-1L796.1,500z M801.4,500
		c0.4,0,0.8-0.2,1.1-0.5l0,0v0.5h0.5v-2.3c0-0.7-0.5-1.2-1.2-1.2h-0.1c-0.6-0.1-1.2,0.4-1.3,1v0.1h0.5c0-0.3,0.3-0.6,0.8-0.6
		c0.4-0.1,0.7,0.2,0.8,0.6v0.1v0.2h-0.8c-1,0-1.4,0.5-1.4,1.1s0.5,1.1,1.1,1.1C801.3,500.1,801.4,500.1,801.4,500L801.4,500z
		 M801.5,499.6c-0.5,0-0.7-0.3-0.7-0.6c0-0.4,0.3-0.6,0.8-0.6h0.8v0.3C802.5,499.2,802.1,499.6,801.5,499.6L801.5,499.6L801.5,499.6
		z M806.5,496.5c-0.3,0-0.6,0.2-0.6,0.6l0,0c0-0.3-0.3-0.6-0.6-0.6l0,0c-0.3,0-0.6,0.2-0.6,0.6l0,0v-0.5h-0.4v3.4h0.5v-2.2
		c0-0.5,0.2-0.8,0.4-0.8c0.3,0,0.4,0.2,0.4,0.6v2.4h0.5v-2.2c0-0.5,0.1-0.8,0.4-0.8c0.3,0,0.3,0.3,0.3,0.5v2.5h0.5v-2.4
		C807.2,497,807.1,496.5,806.5,496.5L806.5,496.5z M809.7,500c0.7,0.1,1.3-0.4,1.4-1h-0.6c-0.1,0.4-0.5,0.6-0.9,0.5
		c-0.6,0-1-0.4-1-1.1h2.4v-0.3c0.1-0.8-0.5-1.5-1.3-1.6c-0.1,0-0.1,0-0.2,0c-1,0-1.5,0.8-1.5,1.8c-0.1,0.9,0.5,1.6,1.3,1.7
		C809.5,500,809.6,500,809.7,500L809.7,500z M808.7,498c0-0.5,0.3-0.9,0.8-1h0.1c0.5,0,0.9,0.3,0.9,0.8v0.1h-1.8V498z M812.5,500
		h0.6l0.5-2.6l0,0l0.5,2.6h0.7l0.5-3.3v-0.1h-0.5l-0.3,2.6l0,0l-0.5-2.6h-0.6l-0.5,2.6l0,0l-0.3-2.6H812v0.1L812.5,500z M817.7,500
		c1.1,0,1.5-0.8,1.5-1.8s-0.5-1.8-1.5-1.8s-1.5,0.8-1.5,1.8S816.6,500,817.7,500L817.7,500z M817.7,499.5c-0.7,0-1-0.5-1-1.3
		c0-0.7,0.3-1.3,1-1.3s1,0.5,1,1.3C818.6,499,818.3,499.5,817.7,499.5L817.7,499.5z M820.1,500h3.1v-0.5h-1.5v-1.2
		c0-0.8,0.3-1.2,0.9-1.2h0.6v-0.5h-0.6c-0.4,0-0.8,0.2-0.9,0.6l0,0v-0.6h-1.4v0.5h0.9v2.5h-1L820.1,500z M824.3,495.1v4.9h0.6v-4.9
		H824.3z M825.6,498.1l1.4-1.4v-0.1h-0.7l-1.4,1.5l1.5,1.9h0.6v-0.1L825.6,498.1z M828.7,498.3h2v-0.5h-2V498.3z M832.1,500h0.6
		l1-1.9l0,0l1,1.9h0.6v-0.1l-1.2-2.3l0,0l1.1-2.2v-0.1h-0.6l-1,1.9l0,0l-0.9-1.9h-0.6v0.1l1.2,2.2l0,0L832.1,500L832.1,500z"/>
    </motion.g>
    <polyline fill="none" stroke="#38E49E" stroke-width="2" stroke-dasharray="6,4" points="320,179 356.7,179 356.7,60.6 436.9,60.6
	"/>
  </svg>
)

