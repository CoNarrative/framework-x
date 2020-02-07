import React from 'react'
import {motion} from "framer-motion"
import {whenMobile, whenTablet} from '../theme'

const Transition = {
  ease: 'linear', duration: 2, yoyo: Infinity
}

export const Shapes = () => (
  <svg css={{
    width: '40%',
    maxHeight: 360,
    marginLeft: 80,
    [whenTablet]: {marginLeft: 0, marginBottom: 64, width: '70%', minWidth: 280},
    [whenMobile]: {marginBottom: 20,}
  }} xmlns="http://www.w3.org/2000/svg" width="525.625" height="490.007" viewBox="0 0 525.625 490.007">
    <g id="Group_4592" data-name="Group 4592" transform="translate(-144.975 -1620.493)">
      <g id="Group_4429" data-name="Group 4429" transform="translate(21 298)">
        <path id="Path_5264" data-name="Path 5264" d="M7286,1937h268l87-88H7374Z" transform="translate(-7091 -149)"
              fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
        <path id="Path_5265" data-name="Path 5265" d="M7230.984,1941.823v24h268v-24Z"
              transform="translate(-7035.984 -153.823)" fill="none" stroke="#fff" strokeLinejoin="round"
              strokeWidth="1"/>
        <path id="Path_5266" data-name="Path 5266" d="M7499,1937v24l87-92v-20Z" transform="translate(-7036 -149)"
              fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="1"/>
      </g>
      <path id="Path_5264-2" data-name="Path 5264" d="M7304.921,1875.2l-123.946-247.8H7706.6l-141.042,247.8Z"
            transform="translate(-7036 163)" fill="rgba(67,68,68,0.31)"/>
      <motion.g id="Group_4430" style={{ x: -61, y: 415 }}>
        <motion.g id="Group_4421" data-name="Group 4421" style={{ x: 416, y: 1248, rotate: 59 }} animate={{y: 1228}} transition={Transition}>
          <motion.path id="Path_5258" data-name="Path 5258" d="M105,0,42,64H0L64.309,0Z" transform="translate(26 25.996)"
                fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="1" transition={{duration: 2, loop: Infinity}} initial={{ pathLength: 0, pathOffset: 1 }} animate={{ pathLength: 1, pathOffset: 0 }}/>
          <path id="Path_5259" data-name="Path 5259" d="M90,26,64,0,0,64,26,90Z" transform="translate(0 0)" fill="#fff"
                stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
          <motion.path id="Path_5260" data-name="Path 5260" d="M0,0H41L67,26H26Z" transform="translate(64 0)"
                fill="rgba(255,255,255,0)" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="1" transition={{duration: 2, loop: Infinity}} initial={{ pathLength: 0, pathOffset: 1 }} animate={{ pathLength: 1, pathOffset: 0 }}/>
        </motion.g>
        <motion.g id="Group_4422" data-name="Group 4422" style={{ x: 280, y: 1400, rotate: 31 }} animate={{y: 1412}} transition={Transition}>
          <path id="Path_5258-2" data-name="Path 5258" d="M92.615,0,37.046,56.454H0L56.723,0Z"
                transform="translate(22.933 22.93)" fill="#141515" stroke="#fff" strokeLinejoin="round"
                strokeWidth="1"/>
          <path id="Path_5259-2" data-name="Path 5259" d="M79.384,22.933,56.451,0,0,56.451,22.933,79.384Z"
                transform="translate(0 0)" fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="1"/>
          <path id="Path_5260-2" data-name="Path 5260" d="M0,0H36.164L59.1,22.933H22.933Z"
                transform="translate(56.451 0)" fill="#141515" stroke="#fff" strokeLinecap="round"
                strokeLinejoin="round" strokeWidth="1"/>
        </motion.g>
        <motion.g id="Group_4423" data-name="Group 4423" style={{ x: 500, y: 1460, rotate: 87}} animate={{y: 1448}} transition={{ease: 'linear', duration: 2, yoyo: Infinity, delay: 0.8}}>
          <path id="Path_5258-3" data-name="Path 5258" d="M71.89,0,28.756,43.821H0L44.03,0Z"
                transform="translate(17.801 17.799)" fill="#141515" stroke="#fff" strokeLinejoin="round"
                strokeWidth="1"/>
          <path id="Path_5259-3" data-name="Path 5259" d="M61.62,17.8,43.819,0,0,43.819l17.8,17.8Z"
                transform="translate(0 0)" fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="1"/>
          <path id="Path_5260-3" data-name="Path 5260" d="M0,0H28.071l17.8,17.8H17.8Z" transform="translate(43.819 0)"
                fill="#141515" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
        </motion.g>
        <g id="Group_4426" data-name="Group 4426" transform="translate(62.828 -125.564) rotate(19)">
          <path id="Path_5262" data-name="Path 5262" d="M52.15,0,104.3,100.25H0Z" transform="translate(616 1223.632)"
                fill="#fff" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1"/>
          <path id="Path_5263" data-name="Path 5263" d="M7807.15,1472.882l20.252-20.253L7779.3,1362l-24.3,10.632Z"
                transform="translate(-7086.849 -149)" fill="none" stroke="#fff" strokeLinecap="square"
                strokeLinejoin="round" strokeWidth="1"/>
        </g>
        <g id="Group_4427" data-name="Group 4427" transform="translate(-390.445 367.89) rotate(-19)">
          <path id="Path_5262-2" data-name="Path 5262" d="M37.183,0,74.366,71.478H0Z"
                transform="translate(616 1220.581)" fill="#fff" stroke="#fff" strokeLinecap="round"
                strokeLinejoin="round" strokeWidth="1"/>
          <path id="Path_5263-2" data-name="Path 5263" d="M7792.183,1441.059l14.44-14.44-34.3-64.619L7755,1369.581Z"
                transform="translate(-7101.817 -149)" fill="none" stroke="#fff" strokeLinecap="square"
                strokeLinejoin="round" strokeWidth="1"/>
        </g>
        <g id="Group_4431" data-name="Group 4431" transform="translate(-599.761 598.397) rotate(-19)">
          <path id="Path_5262-3" data-name="Path 5262" d="M28.972,0,57.944,55.694H0Z"
                transform="translate(616 1218.907)" fill="#fff" stroke="#fff" strokeLinecap="round"
                strokeLinejoin="round" strokeWidth="1"/>
          <path id="Path_5263-3" data-name="Path 5263" d="M7783.972,1423.6l11.251-11.251L7768.5,1362l-13.5,5.907Z"
                transform="translate(-7110.028 -149)" fill="#141515" stroke="#fff" strokeLinecap="square"
                strokeLinejoin="round" strokeWidth="1"/>
        </g>
      </motion.g>
    </g>
  </svg>
)
