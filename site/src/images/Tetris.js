import React from 'react'
import {motion} from "framer-motion"
import {whenTablet} from "../theme";

const LineDuration = 0.8
const DelayMultiplier = 7
const BlockDurations = [3.6, 3.6, 3.6, 2.8, 2.8, 3.6, 2.8, 2.8]
// const BlockDurations = [0.4, 0.4, 0.4, 0.4, 0.4, 3.6, 2.8, 2.8]

const addDuration = (position) => {
  let sum = 0
  for (let i = 1; i <= position; i++)
    sum = sum + BlockDurations[i - 1]
  return sum
}

function BlockH(func, x, y) {

  switch (func) {
    case "initialY":
      return {
        x: x,
        y: y,
        opacity: 0,
      }
    case "animateY":
      return {
        x: x,
        y: [y - 100, y - 80, y - 60, y - 40, y - 20, y],
        opacity: [1, 1, 1, 1, 1, 1],
      }
    case "transitionY":
      return {
        // loop: Infinity,
        duration: BlockDurations[7],
        delay: addDuration(7),
        ease: "circInOut",
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    case "initialX":
      return {
        x: x,
        y: y,
      }
    case "animateX":
      return {
        x: [-40, -20, 0]
      }
    case "transitionX":
      return {
        // loop: Infinity,
        delay: 0.6 + addDuration(7),
        duration: 0.8,
        ease: "circInOut",
      }
  }
}

function BlockG(func, x, y) {

  switch (func) {
    case "initialY":
      return {
        x: x,
        y: y,
        opacity: 0,
      }
    case "animateY":
      return {
        x: x,
        y: [y - 100, y - 80, y - 60, y - 40, y - 20, y],
        opacity: [1, 1, 1, 1, 1, 1],
      }
    case "transitionY":
      return {
        // loop: Infinity,
        delay: addDuration(6),
        duration: BlockDurations[6],
        ease: "circInOut",
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    case "initialX":
      return {
        x: x,
        y: y,
      }
    case "animateX":
      return {
        x: [-20, 0]
      }
    case "transitionX":
      return {
        // loop: Infinity,
        delay: 0.6 + addDuration(6),
        duration: 0.6,
        ease: "circInOut",
      }
  }
}

function BlockF(func, x, y) {

  switch (func) {
    case "initialY":
      return {
        x: x,
        y: y,
        opacity: 0,
      }
    case "animateY":
      return {
        x: x,
        y: [y-140, y-120, y - 100, y - 80, y - 60, y - 40, y - 20, y],
        opacity: [1, 1, 1, 1, 1, 1,1,1],
      }
    case "transitionY":
      return {
        // loop: Infinity,
        duration: BlockDurations[5],
        delay: addDuration(5),
        ease: "circInOut",
      }
    case "initialX":
      return {
        x: x,
        y: y,
      }
    case "animateX":
      return {
        x: [-20, 0]
      }
    case "transitionX":
      return {
        // loop: Infinity,
        delay: 0.6 + addDuration(5),
        duration: 0.6,
        ease: "circInOut",
      }
  }
}

function BlockE(func, x, y) {

  switch (func) {
    case "initialY":
      return {
        x: x,
        y: y,
        opacity: 0,
      }
    case "animateY":
      return {
        x: x,
        y: [y - 100, y - 80, y - 60, y - 40, y - 20, y],
        opacity: [1, 1, 1, 1, 1, 1],
      }
    case "transitionY":
      return {
        // loop: Infinity,
        duration: BlockDurations[4],
        delay: addDuration(4),
        ease: "circInOut",
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    case "initialX":
      return {
        x: x,
        y: y,
      }
    case "animateX":
      return {
        x: [20, 0]
      }
    case "transitionX":
      return {
        // loop: Infinity,
        delay: 0.6 + addDuration(4),
        duration: 0.6,
        ease: "circInOut",
      }
  }
}

function BlockD(func, x, y) {

  switch (func) {
    case "initialY":
      return {
        x: x,
        y: y,
        opacity: 0,
      }
    case "animateY":
      return {
        x: x,
        y: [y - 100, y - 80, y - 60, y - 40, y - 20, y],
        opacity: [1, 1, 1, 1, 1, 1],
      }
    case "transitionY":
      return {
        // loop: Infinity,
        duration: BlockDurations[3],
        delay: addDuration(3),
        ease: "circInOut",
        times: [0, 0.2, 0.4, 0.6, 0.8, 1]
      }
    case "initialX":
      return {
        x: x,
        y: y,
      }
    case "animateX":
      return {
        x: [40, 20, 0]
      }
    case "transitionX":
      return {
        // loop: Infinity,
        delay: 0.6 + addDuration(3),
        duration: 0.6,
        ease: "circInOut",
      }
  }
}

function BlockC(func, x, y) {

  switch (func) {
    case "initialY":
      return {
        x: x,
        y: y,
        opacity: 0,
      }
    case "animateY":
      return {
        x: x,
        y: [y-140, y - 120, y - 100, y - 80, y - 60, y - 40, y - 20, y],
        opacity: [1, 1, 1, 1, 1, 1, 1, 1],
      }
    case "transitionY":
      return {
        // loop: Infinity,
        duration: BlockDurations[2],
        delay: addDuration(2),
        ease: "circInOut",
      }
    case "initialX":
      return {
        x: x,
        y: y,
      }
    case "animateX":
      return {
        x: [-20, 0]
      }
    case "transitionX":
      return {
        // loop: Infinity,
        delay: 0.6 + addDuration(2),
        duration: 0.6,
        ease: "circInOut",
      }
  }
}

function BlockB(func, x, y) {

  switch (func) {
    case "initialY":
      return {
        x: x,
        y: y,
        opacity: 0,
      }
    case "animateY":
      return {
        x: x,
        y: [y - 140, y - 120, y - 100, y - 80, y - 60, y - 40, y - 20, y],
        opacity: [1, 1, 1, 1, 1, 1, 1, 1],
      }
    case "transitionY":
      return {
        // loop: Infinity,
        duration: BlockDurations[1],
        delay: addDuration(1),
        ease: "circInOut",
      }
    case "initialX":
      return {
        x: x,
        y: y,
      }
    case "animateX":
      return {
        x: [10, 10, 20, 20, 10, 0]
      }
    case "transitionX":
      return {
        // loop: Infinity,
        delay: 1.8 + addDuration(1),
        duration: 1.8,
        ease: "circInOut",
        times: [0, 0.12, 0.24, 0.96 , 0.98, 1]
      }
  }
}

function BlockA(func, x, y) {

  switch (func) {
    case "initialY":
      return {
        x: x,
        y: y,
        opacity: 0,
      }
    case "animateY":
      return {
        x: x,
        y: [y - 140, y - 120, y - 100, y - 80, y - 60, y - 40, y - 20, y],
        opacity: [1, 1, 1, 1, 1, 1, 1, 1],
      }
    case "transitionY":
      return {
        // loop: Infinity,
        duration: BlockDurations[0],
        delay: addDuration(0),
        ease: "circInOut",
      }
    case "initialX":
      return {
        x: x,
        y: y,
      }
    case "animateX":
      return {
        x: [40, 0]
      }
    case "transitionX":
      return {
        // loop: Infinity,
        delay: 0.6 + addDuration(0),
        duration: 0.6,
        ease: "circInOut",
      }
  }
}

function FlashWhite(func) {
  switch (func) {
    case "animate":
      return {
        fill: [null,"#fff","#000","#fff"]
      }
    case "transition":
      return {
        // loop: Infinity,
        delay: addDuration(6),
        duration: 0.4,
      }
  }
}

function MoveDown1(func) {
  switch (func) {
    case "animate":
      return {
        y: 45
      }
    case "transition":
      return {
        // loop: Infinity,
        delay: addDuration(6),
        duration: 0.4,
      }
  }
}

function MoveDown2(func) {
  switch (func) {
    case "animate":
      return {
        y: 30
      }
    case "transition":
      return {
        // loop: Infinity,
        delay: addDuration(8),
        duration: 0.4,
      }
  }
}

export const Tetris = () => (
  <svg
    css={{
      minWidth: 600,
      maxHeight: 360,
      marginLeft: 80,
      [whenTablet]: {marginLeft: 0, marginBottom: 64, width: '70%', minWidth: 280}
    }}
    id="tetris-final" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 110 161">
    <defs>
      <clipPath id="clip-path">
        <rect id="Rectangle_129" data-name="Rectangle 129" width="97" height="157" transform="translate(9)"/>
      </clipPath>
    </defs>
    <path id="Path_5857" d="M13.2,160.7.9,156,1,0,13.2,4Z" fill="#cacaca"/>
    <g id="Group_4602">
      <path id="Path_5855" d="M109,161l-12-4V0l12,4Z" fill="#cacaca"/>
      <rect id="Rectangle_59" width="1" height="157" fill="#141515"/>
      <path id="Path_5854" d="M1,156.3H96.6l11.1,4.4H13.4Z" fill="#cacaca"/>
      <g id="Group_4601">
        <rect id="Rectangle_60" width="1" height="157" transform="translate(96)" fill="#141515"/>
        <rect id="Rectangle_62" width="1" height="157" transform="translate(109 4)" fill="#141515"/>
        <rect id="Rectangle_61" width="97" height="1" transform="translate(0 156)" fill="#141515"/>
        <rect id="Rectangle_63" width="97" height="1" transform="translate(13 160)" fill="#141515"/>
        <path id="Path_5852" d="M.4,156.6l13,3.9" fill="none" stroke="#141515" strokeWidth="1"/>
        <path id="Path_5853" d="M96.5,156.5,109,160" fill="none" stroke="#141515" strokeWidth="1"/>
      </g>
    </g>
    <g id="Group_4610">
      <g id="Group_4611" data-name="Group 4611">
        <g id="Group_4604" transform="translate(-9)" clipPath="url(#clip-path)">
          <motion.g animate={MoveDown1("animate")} transition={MoveDown1("transition")}>
            <motion.g animate={MoveDown2("animate")} transition={MoveDown2("transition")}>
              <motion.g id="blockD-01" initial={BlockD("initialY", 7293, 3033)} animate={BlockD("animateY", 7293, 3033)}
                        transition={BlockD("transitionY")}>
                <motion.g animate={BlockD("animateX")} transition={BlockD("transitionX")}>
                  <g id="Rectangle_Copy_2-2" transform="translate(343 478)">
                    <path id="Path_5867" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#7ef9c7"/>
                    <path id="Path_5868"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#7ef9c7"/>
                  </g>
                  <path id="Path_890-2" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-2" transform="translate(343 478)">
                    <rect id="Rectangle_66" width="17" height="16" transform="translate(-7627 -3430)" fill="#7ef9c7"/>
                    <rect id="Rectangle_67" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockD-02" initial={BlockD("initialY", 7293, 3048)} animate={BlockD("animateY", 7293, 3048)}
                        transition={BlockD("transitionY")}>
                <motion.g animate={BlockD("animateX")} transition={BlockD("transitionX")}>
                  <g id="Rectangle_Copy_2-3" transform="translate(343 478)">
                    <path id="Path_5869" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#7ef9c7"/>
                    <path id="Path_5870"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#7ef9c7"/>
                  </g>
                  <path id="Path_890-3" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-3" transform="translate(343 478)">
                    <rect id="Rectangle_68" width="17" height="16" transform="translate(-7627 -3430)" fill="#7ef9c7"/>
                    <rect id="Rectangle_69" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockD-04" initial={BlockD("initialY", 7293, 3063)} animate={BlockD("animateY", 7293, 3063)}
                        transition={BlockD("transitionY")}>
                <motion.g animate={BlockD("animateX")} transition={BlockD("transitionX")}>
                  <g id="Rectangle_Copy_2-4" transform="translate(343 478)">
                    <path id="Path_5871" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#7ef9c7"/>
                    <path id="Path_5872"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#7ef9c7"/>
                  </g>
                  <path id="Path_890-4" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-4" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_70" width="17" height="16" transform="translate(-7627 -3430)" fill="#7ef9c7"/>
                    <rect id="Rectangle_71" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockA-03" initial={BlockA("initialY", 7293, 3078)} animate={BlockA("animateY", 7293, 3078)}
                        transition={BlockA("transitionY")}>
                <motion.g animate={BlockA("animateX")} transition={BlockA("transitionX")}>
                  <g id="Rectangle_Copy_2-5" transform="translate(343 478)">
                    <path id="Path_5873" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#62c09a"/>
                    <path id="Path_5874"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#62c09a"/>
                  </g>
                  <path id="Path_890-5" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-5" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_72" width="17" height="16" transform="translate(-7627 -3430)" fill="#62c09a"/>
                    <rect id="Rectangle_73" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockA-04" initial={BlockA("initialY", 7293, 3093)} animate={BlockA("animateY", 7293, 3093)}
                        transition={BlockA("transitionY")}>
                <motion.g animate={BlockA("animateX")} transition={BlockA("transitionX")}>
                  <g id="Rectangle_Copy_2-6" transform="translate(343 478)">
                    <path id="Path_5875" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#62c09a"/>
                    <path id="Path_5876"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#62c09a"/>
                  </g>
                  <path id="Path_890-6" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-6" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_74" width="17" height="16" transform="translate(-7627 -3430)" fill="#62c09a"/>
                    <rect id="Rectangle_75" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockE-01" initial={BlockE("initialY", 7309, 3033)} animate={BlockE("animateY", 7309, 3033)}
                        transition={BlockE("transitionY")}>
                <motion.g animate={BlockE("animateX")} transition={BlockE("transitionX")}>
                  <g id="Rectangle_Copy_2-7" transform="translate(343 478)">
                    <path id="Path_5877" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#2dcd8c"/>
                    <path id="Path_5878"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#2dcd8c"/>
                  </g>
                  <path id="Path_890-7" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-7" transform="translate(343 478)">
                    <rect id="Rectangle_76" width="17" height="16" transform="translate(-7627 -3430)" fill="#2dcd8c"/>
                    <rect id="Rectangle_77" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockE-02" initial={BlockE("initialY", 7325, 3033)} animate={BlockE("animateY", 7325, 3033)}
                        transition={BlockE("transitionY")}>
                <motion.g animate={BlockE("animateX")} transition={BlockE("transitionX")}>
                  <g id="Rectangle_Copy_2-8" transform="translate(343 478)">
                    <path id="Path_5879" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#2dcd8c"/>
                    <path id="Path_5880"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#2dcd8c"/>
                  </g>
                  <path id="Path_890-8" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-8" transform="translate(343 478)">
                    <rect id="Rectangle_78" width="17" height="16" transform="translate(-7627 -3430)" fill="#2dcd8c"/>
                    <rect id="Rectangle_79" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g initial={BlockG("initialY", 7341, 3033)} animate={BlockG("animateY", 7341, 3033)}
                        transition={BlockG("transitionY")} id="blockG-01">
                <motion.g animate={BlockG("animateX")} transition={BlockG("transitionX")}>
                  <g id="Rectangle_Copy_2-9" transform="translate(343 478)">
                    <path id="Path_5881" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#7ef9c7"/>
                    <path id="Path_5882"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#7ef9c7"/>
                  </g>
                  <path id="Path_890-9" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-9" transform="translate(343 478)">
                    <rect id="Rectangle_80" width="17" height="16" transform="translate(-7627 -3430)" fill="#7ef9c7"/>
                    <rect id="Rectangle_81" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g initial={BlockG("initialY", 7357, 3033)} animate={BlockG("animateY", 7357, 3033)}
                        transition={BlockG("transitionY")} id="blockG-02">
                <motion.g animate={BlockG("animateX")} transition={BlockG("transitionX")}>
                  <g id="Rectangle_Copy_2-10" transform="translate(343 478)">
                    <path id="Path_5883" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#7ef9c7"/>
                    <path id="Path_5884"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#7ef9c7"/>
                  </g>
                  <path id="Path_890-10" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-10" transform="translate(343 478)">
                    <rect id="Rectangle_82" width="17" height="16" transform="translate(-7627 -3430)" fill="#7ef9c7"/>
                    <rect id="Rectangle_83" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockD-03" initial={BlockD("initialY", 7309, 3048)} animate={BlockD("animateY", 7309, 3048)}
                        transition={BlockD("transitionY")}>
                <motion.g animate={BlockD("animateX")} transition={BlockD("transitionX")}>
                  <g id="Rectangle_Copy_2-11" transform="translate(343 478)">
                    <path id="Path_5885" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#7ef9c7"/>
                    <path id="Path_5886"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#7ef9c7"/>
                  </g>
                  <path id="Path_890-11" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-11" transform="translate(343 478)">
                    <rect id="Rectangle_84" width="17" height="16" transform="translate(-7627 -3430)" fill="#7ef9c7"/>
                    <rect id="Rectangle_85" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockE-03" initial={BlockE("initialY", 7325, 3048)} animate={BlockE("animateY", 7325, 3048)}
                        transition={BlockE("transitionY")}>
                <motion.g animate={BlockE("animateX")} transition={BlockE("transitionX")}>
                  <g id="Rectangle_Copy_2-12" transform="translate(343 478)">
                    <path id="Path_5887" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#2dcd8c"/>
                    <path id="Path_5888"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#2dcd8c"/>
                  </g>
                  <path id="Path_890-12" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-12" transform="translate(343 478)">
                    <rect id="Rectangle_86" width="17" height="16" transform="translate(-7627 -3430)" fill="#2dcd8c"/>
                    <rect id="Rectangle_87" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g initial={BlockG("initialY", 7341, 3048)} animate={BlockG("animateY", 7341, 3048)}
                        transition={BlockG("transitionY")} id="blockG-03">
                <motion.g animate={BlockG("animateX")} transition={BlockG("transitionX")}>
                  <g id="Rectangle_Copy_2-13" transform="translate(343 478)">
                    <path id="Path_5889" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#7ef9c7"/>
                    <path id="Path_5890"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#7ef9c7"/>
                  </g>
                  <path id="Path_890-13" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-13" transform="translate(343 478)">
                    <rect id="Rectangle_88" width="17" height="16" transform="translate(-7627 -3430)" fill="#7ef9c7"/>
                    <rect id="Rectangle_89" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockG-04" initial={BlockG("initialY", 7357, 3048)} animate={BlockG("animateY", 7357, 3048)}
                        transition={BlockG("transitionY")}>
                <motion.g animate={BlockG("animateX")} transition={BlockG("transitionX")}>
                  <g id="Rectangle_Copy_2-14" transform="translate(343 478)">
                    <path id="Path_5891" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#7ef9c7"/>
                    <path id="Path_5892"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#7ef9c7"/>
                  </g>
                  <path id="Path_890-14" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-14" transform="translate(343 478)">
                    <rect id="Rectangle_90" width="17" height="16" transform="translate(-7627 -3430)" fill="#7ef9c7"/>
                    <rect id="Rectangle_91" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockA-02" initial={BlockA("initialY", 7309, 3063)} animate={BlockA("animateY", 7309, 3063)}
                        transition={BlockA("transitionY")}>
                <motion.g animate={BlockA("animateX")} transition={BlockA("transitionX")}>
                  <g id="Rectangle_Copy_2-15" transform="translate(343 478)">
                    <path id="Path_5893" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#62c09a"/>
                    <path id="Path_5894"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#62c09a"/>
                  </g>
                  <path id="Path_890-15" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-15" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_92" width="17" height="16" transform="translate(-7627 -3430)" fill="#62c09a"/>
                    <rect id="Rectangle_93" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockA-01" initial={BlockA("initialY", 7309, 3078)} animate={BlockA("animateY", 7309, 3078)}
                        transition={BlockA("transitionY")}>
                <motion.g animate={BlockA("animateX")} transition={BlockA("transitionX")}>
                  <g id="Rectangle_Copy_2-16" transform="translate(343 478)">
                    <path id="Path_5895" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#62c09a"/>
                    <path id="Path_5896"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#62c09a"/>
                  </g>
                  <path id="Path_890-16" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-16" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_94" width="17" height="16" transform="translate(-7627 -3430)" fill="#62c09a"/>
                    <rect id="Rectangle_95" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockE-04" initial={BlockE("initialY", 7325, 3063)} animate={BlockE("animateY", 7325, 3063)}
                        transition={BlockE("transitionY")}>
                <motion.g animate={BlockE("animateX")} transition={BlockE("transitionX")}>
                  <g id="Rectangle_Copy_2-17" transform="translate(343 478)">
                    <path id="Path_5897" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#2dcd8c"/>
                    <path id="Path_5898"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#2dcd8c"/>
                  </g>
                  <path id="Path_890-17" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-17" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_96" width="17" height="16" transform="translate(-7627 -3430)" fill="#2dcd8c"/>
                    <rect id="Rectangle_97" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockB-04" initial={BlockB("initialY", 7309, 3093)} animate={BlockB("animateY", 7309, 3093)}
                        transition={BlockB("transitionY")}>
                <motion.g animate={BlockB("animateX")} transition={BlockB("transitionX")}>
                  <g id="Rectangle_Copy_2-18" transform="translate(343 478)">
                    <path id="Path_5899" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#7ef9c7"/>
                    <path id="Path_5900"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#7ef9c7"/>
                  </g>
                  <path id="Path_890-18" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-18" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_98" width="17" height="16" transform="translate(-7627 -3430)" fill="#7ef9c7"/>
                    <rect id="Rectangle_99" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockC-01" initial={BlockC("initialY", 7341, 3063)} animate={BlockC("animateY", 7341, 3063)}
                        transition={BlockC("transitionY")}>
                <motion.g animate={BlockC("animateX")} transition={BlockC("transitionX")}>
                  <g id="Rectangle_Copy_2-19" transform="translate(343 478)">
                    <path id="Path_5901" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#62c09a"/>
                    <path id="Path_5902"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#62c09a"/>
                  </g>
                  <path id="Path_890-19" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-19" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_100" width="17" height="16" transform="translate(-7627 -3430)" fill="#62c09a"/>
                    <rect id="Rectangle_101" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockB-01" initial={BlockB("initialY", 7325, 3078)} animate={BlockB("animateY", 7325, 3078)}
                        transition={BlockB("transitionY")}>
                <motion.g animate={BlockB("animateX")} transition={BlockB("transitionX")}>
                  <g id="Rectangle_Copy_2-20" transform="translate(343 478)">
                    <path id="Path_5903" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#7ef9c7"/>
                    <path id="Path_5904"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#7ef9c7"/>
                  </g>
                  <path id="Path_890-20" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-20" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_102" width="17" height="16" transform="translate(-7627 -3430)" fill="#7ef9c7"/>
                    <rect id="Rectangle_103" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockB-02" initial={BlockB("initialY", 7325, 3093)} animate={BlockB("animateY", 7325, 3093)}
                        transition={BlockB("transitionY")}>
                <motion.g animate={BlockB("animateX")} transition={BlockB("transitionX")}>
                  <g id="Rectangle_Copy_2-21" transform="translate(343 478)">
                    <path id="Path_5905" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#7ef9c7"/>
                    <path id="Path_5906"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#7ef9c7"/>
                  </g>
                  <path id="Path_890-21" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-21" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_104" width="17" height="16" transform="translate(-7627 -3430)" fill="#7ef9c7"/>
                    <rect id="Rectangle_105" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockC-02" initial={BlockC("initialY", 7341, 3078)} animate={BlockC("animateY", 7341, 3078)}
                        transition={BlockC("transitionY")}>
                <motion.g animate={BlockC("animateX")} transition={BlockC("transitionX")}>
                  <g id="Rectangle_Copy_2-22" transform="translate(343 478)">
                    <path id="Path_5907" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#62c09a"/>
                    <path id="Path_5908"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#62c09a"/>
                  </g>
                  <path id="Path_890-22" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-22" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_106" width="17" height="16" transform="translate(-7627 -3430)" fill="#62c09a"/>
                    <rect id="Rectangle_107" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockB-03" initial={BlockB("initialY", 7341, 3093)} animate={BlockB("animateY", 7341, 3093)}
                        transition={BlockB("transitionY")}>
                <motion.g animate={BlockB("animateX")} transition={BlockB("transitionX")}>
                  <g id="Rectangle_Copy_2-23" transform="translate(343 478)">
                    <path id="Path_5909" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#7ef9c7"/>
                    <path id="Path_5910"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#7ef9c7"/>
                  </g>
                  <path id="Path_890-23" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-23" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_108" width="17" height="16" transform="translate(-7627 -3430)" fill="#7ef9c7"/>
                    <rect id="Rectangle_109" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockF-01" initial={BlockF("initialY", 7357, 3063)} animate={BlockF("animateY", 7357, 3063)}
                        transition={BlockF("transitionY")}>
                <motion.g animate={BlockF("animateX")} transition={BlockF("transitionX")}>
                  <g id="Rectangle_Copy_2-24" transform="translate(343 478)">
                    <path id="Path_5911" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#2dcd8c"/>
                    <path id="Path_5912"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#2dcd8c"/>
                  </g>
                  <path id="Path_890-24" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-24" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_110" width="17" height="16" transform="translate(-7627 -3430)" fill="#2dcd8c"/>
                    <rect id="Rectangle_111" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockC-03" initial={BlockC("initialY", 7357, 3078)} animate={BlockC("animateY", 7357, 3078)}
                        transition={BlockC("transitionY")}>
                <motion.g animate={BlockC("animateX")} transition={BlockC("transitionX")}>
                  <g id="Rectangle_Copy_2-26" transform="translate(343 478)">
                    <path id="Path_5915" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#62c09a"/>
                    <path id="Path_5916"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#62c09a"/>
                  </g>
                  <path id="Path_890-26" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-26" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_114" width="17" height="16" transform="translate(-7627 -3430)" fill="#62c09a"/>
                    <rect id="Rectangle_115" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockC-04" initial={BlockC("initialY", 7357, 3093)} animate={BlockC("animateY", 7357, 3093)}
                        transition={BlockC("transitionY")}>
                <motion.g animate={BlockC("animateX")} transition={BlockC("transitionX")}>
                  <g id="Rectangle_Copy_2-27" transform="translate(343 478)">
                    <path id="Path_5917" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#62c09a"/>
                    <path id="Path_5918"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#62c09a"/>
                  </g>
                  <path id="Path_890-27" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-27" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_116" width="17" height="16" transform="translate(-7627 -3430)" fill="#62c09a"/>
                    <rect id="Rectangle_117" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g initial={BlockH("initialY", 7373, 3063)} animate={BlockH("animateY", 7373, 3063)}
                        transition={BlockH("transitionY")} id="blockH-01">
                <motion.g animate={BlockH("animateX")} transition={BlockH("transitionX")}>
                  <g id="Rectangle_Copy_2-30_2_" transform="translate(343 478)">
                    <path id="Path_5923_2_" d="M-7606.5-3470.52h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z"
                          fill="#62c09a"/>
                    <path id="Path_5924_2_"
                          d="M-7610.2-3488.82l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#141515"/>
                  </g>
                  <path id="Path_890-30_2_" d="M-7267.8-2996.93l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-30_2_" transform="translate(343 478)">
                    <rect id="Rectangle_122_2_" width="17" height="16" transform="translate(-7627 -3490.02)"
                          fill="#62c09a"/>
                    <rect id="Rectangle_123_2_" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3489.52)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g initial={BlockH("initialY", 7373, 3063)} animate={BlockH("animateY", 7373, 3063)}
                        transition={BlockH("transitionY")} id="blockH-02">
                <motion.g animate={BlockH("animateX")} transition={BlockH("transitionX")}>
                  <g id="Rectangle_Copy_2-30_1_" transform="translate(343 478)">
                    <path id="Path_5923_1_" d="M-7606.5-3455.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z"
                          fill="#62c09a"/>
                    <path id="Path_5924_1_"
                          d="M-7610.2-3473.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#141515"/>
                  </g>
                  <path id="Path_890-30_1_" d="M-7267.8-2981.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-30_1_" transform="translate(343 478)">
                    <rect id="Rectangle_122_1_" width="17" height="16" transform="translate(-7627 -3475)" fill="#62c09a"/>
                    <rect id="Rectangle_123_1_" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3474.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g initial={BlockH("initialY", 7373, 3078)} animate={BlockH("animateY", 7373, 3078)}
                        transition={BlockH("transitionY")}
                        id="blockH-03">
                <motion.g animate={BlockH("animateX")} transition={BlockH("transitionX")}>
                  <g id="Rectangle_Copy_2-31_1_" transform="translate(343 478)">
                    <path id="Path_5925_1_" d="M-7606.5-3455.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z"
                          fill="#62c09a"/>
                    <path id="Path_5926_1_"
                          d="M-7610.2-3473.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#141515"/>
                  </g>
                  <path id="Path_890-31_1_" d="M-7267.8-2981.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-31_1_" transform="translate(343 478)">
                    <rect id="Rectangle_124_1_" width="17" height="16" transform="translate(-7627 -3475)" fill="#62c09a"/>
                    <rect id="Rectangle_125_1_" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3474.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g initial={BlockH("initialY", 7373, 3093)} animate={BlockH("animateY", 7373, 3093)}
                        transition={BlockH("transitionY")}
                        id="blockH-04">
                <motion.g animate={BlockH("animateX")} transition={BlockH("transitionX")}>
                  <g id="Rectangle_Copy_2-32_1_" transform="translate(343 478)">
                    <path id="Path_5927_1_" d="M-7606.5-3455.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z"
                          fill="#62c09a"/>
                    <path id="Path_5928_1_"
                          d="M-7610.2-3473.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#141515"/>
                  </g>
                  <path id="Path_890-32_1_" d="M-7267.8-2981.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-32_1_" transform="translate(343 478)">
                    <rect id="Rectangle_126_1_" width="17" height="16" transform="translate(-7627 -3475)" fill="#62c09a"/>
                    <rect id="Rectangle_127_1_" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3474.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockF-02" initial={BlockF("initialY", 7373, 3063)} animate={BlockF("animateY", 7373, 3063)}
                        transition={BlockF("transitionY")}>
                <motion.g animate={BlockF("animateX")} transition={BlockF("transitionX")}>
                  <g id="Rectangle_Copy_2-30" transform="translate(343 478)">
                    <path id="Path_5923" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#2dcd8c"/>
                    <path id="Path_5924"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#141515"/>
                  </g>
                  <path id="Path_890-30" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-30" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_122" width="17" height="16" transform="translate(-7627 -3430)" fill="#2dcd8c"/>
                    <rect id="Rectangle_123" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockF-03" initial={BlockF("initialY", 7373, 3078)} animate={BlockF("animateY", 7373, 3078)}
                        transition={BlockF("transitionY")}>
                <motion.g animate={BlockF("animateX")} transition={BlockF("transitionX")}>
                  <g id="Rectangle_Copy_2-31" transform="translate(343 478)">
                    <path id="Path_5925" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#2dcd8c"/>
                    <path id="Path_5926"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#141515"/>
                  </g>
                  <path id="Path_890-31" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-31" transform="translate(343 478)">
                    <motion.rect animate={FlashWhite("animate")} transition={FlashWhite("transition")} id="Rectangle_124" width="17" height="16" transform="translate(-7627 -3430)" fill="#2dcd8c"/>
                    <rect id="Rectangle_125" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
              <motion.g id="blockF-04" initial={BlockF("initialY", 7373, 3093)} animate={BlockF("animateY", 7373, 3093)}
                        transition={BlockF("transitionY")}>
                <motion.g animate={BlockF("animateX")} transition={BlockF("transitionX")}>
                  <g id="Rectangle_Copy_2-32" transform="translate(343 478)">
                    <path id="Path_5927" d="M-7606.5-3410.5h-16.7l-3.2-3.6,6.4-11.5,9.9-3.8,3.6,3.6v15.3Z" fill="#2dcd8c"/>
                    <path id="Path_5928"
                          d="M-7610.2-3428.8l-9.4,3.6-6.1,11.1,2.8,3.1h15.9v-14.6l-3.2-3.2m.2-1.2,4,4v16h-17.4l-3.6-4,6.6-12Z"
                          fill="#141515"/>
                  </g>
                  <path id="Path_890-32" d="M-7267.8-2936.9l4.4,4.2" fill="none" stroke="#141515" strokeWidth="1"/>
                  <g id="Rectangle_Copy_4-32" transform="translate(343 478)">
                    <motion.rect id="Rectangle_126" width="17" height="16" transform="translate(-7627 -3430)" fill="#2dcd8c" animate={FlashWhite("animate")} transition={FlashWhite("transition")}/>
                    <rect id="Rectangle_127" width="16" height="15" strokeWidth="1" fill="none" stroke="#141515"
                          strokeMiterlimit="10" transform="translate(-7626.5 -3429.5)"/>
                  </g>
                </motion.g>
              </motion.g>
            </motion.g>
          </motion.g>
        </g>
      </g>
    </g>
  </svg>
)
