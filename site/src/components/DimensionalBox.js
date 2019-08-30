import React from "react"
import {jsx} from '@emotion/core'
import styled from '@emotion/styled'
import * as theme from '../theme'

const Svg = styled.svg({
  position: 'absolute',
  left: 0,
  zIndex: -1,
})

const Box = styled.div( props => ({
  display: 'flex',
  fontFamily: 'Basier Square Mono',
  fontSize: 14,
  height: props.height,
  width: props.width - 6,
  paddingBottom: 6,
  position: 'relative',
  ...props.rootCss,
}))

const SvgBox = ({width, height, color}) => (
  <Svg width={width} height={height} viewBox={'0 0 ' + width + ' ' + height}>
    <g id="_3d-box" data-name="3d-box" transform="translate(-342.988 -478)">
      <g id="Group_4490" data-name="Group 4490">
        <path id="Path_890" data-name="Path 890" d="M152,37l7.5,6.5" transform={'translate(' + (width + 183) + ' ' + (height + 434) + ')'} fill="none" stroke={color ? color : theme.black} strokeWidth="1"/>
        <path id="Path_5287" data-name="Path 5287" d="M153.34,37.632l6.06,6.008" transform={'translate(190 ' + (height + 434) + ')'} fill="none" stroke={color ? color : theme.black} strokeWidth="1"/>
        <path id="Path_5285" data-name="Path 5285" d="M152.7,37.4l7.006,6.023" transform={'translate(' + (width + 183) + ' ' + (441) + ')'} fill="none" stroke={color ? color : theme.black} strokeWidth="1"/>
        <line id="Line_1" data-name="Line 1" x2={width - 7} transform={'translate(349 ' + (height + 477.5) + ')'} fill="none" stroke={color ? color : theme.black} strokeWidth="1"/>
        <line id="Line_2" data-name="Line 2" y1={height - 6} transform={'translate(' + (width + 342.5) + ' ' + (484) + ')'} fill="none" stroke={color ? color : theme.black} strokeWidth="1"/>
      </g>
      <g id="Rectangle_33" data-name="Rectangle 33" transform="translate(343 478)" fill="#fff" stroke={color ? color : theme.black} strokeWidth="1">
        <rect width={width - 7} height={height - 6} stroke="none"/>
        <rect x="0.5" y="0.5" width={width - 8} height={height - 7} fill="none"/>
      </g>
    </g>
  </Svg>
)

export const DimensionalBox = ({rootCss, width, height, color, children}) => (
  <Box rootCss={rootCss} height={height} width={width}>
    <SvgBox width={width} height={height} color={color}/>
    {children}
  </Box>
)
