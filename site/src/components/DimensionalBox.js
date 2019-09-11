import React from "react"
import ReactDOM from 'react-dom'
import {jsx} from '@emotion/core'
import styled from '@emotion/styled'
import * as theme from '../theme'
import ReactResizeDetector from 'react-resize-detector';


const Svg = styled.svg({
  position: 'absolute',
  left: 0,
  top: 0,
  zIndex: -1,
})

const Box = styled.div(props => ({
  display: 'flex',
  fontFamily: 'Basier Square Mono',
  fontSize: 14,
  paddingTop: 1,
  paddingLeft: 1,
  height: 'auto',
  width: props.width ? props.width : '100%',
  // maxWidth: props.maxWidth,
  position: 'relative',
  ...props.rootCss,
}))

const SvgBox = ({width, height, color}) => (
  <Svg width={width} height={height} viewBox={'0 0 ' + width + ' ' + height}>
    <g id="_3d-box" data-name="3d-box" transform="translate(-342.988 -478)">
      <g id="Group_4490" data-name="Group 4490">
        <path id="Path_890" data-name="Path 890" d="M152,37l7.5,6.5"
              transform={'translate(' + (width + 183) + ' ' + (height + 434) + ')'} fill="none"
              stroke={color ? color : theme.black} strokeWidth="1"/>
        <path id="Path_5287" data-name="Path 5287" d="M153.34,37.632l6.06,6.008"
              transform={'translate(190 ' + (height + 434) + ')'} fill="none" stroke={color ? color : theme.black}
              strokeWidth="1"/>
        <path id="Path_5285" data-name="Path 5285" d="M152.7,37.4l7.006,6.023"
              transform={'translate(' + (width + 183) + ' ' + (441) + ')'} fill="none"
              stroke={color ? color : theme.black} strokeWidth="1"/>
        <line id="Line_1" data-name="Line 1" x2={width - 7} transform={'translate(349 ' + (height + 477.5) + ')'}
              fill="none" stroke={color ? color : theme.black} strokeWidth="1"/>
        <line id="Line_2" data-name="Line 2" y1={height - 6}
              transform={'translate(' + (width + 342.5) + ' ' + (484) + ')'} fill="none"
              stroke={color ? color : theme.black} strokeWidth="1"/>
      </g>
      <g id="Rectangle_33" data-name="Rectangle 33" transform="translate(343 478)" fill="#fff"
         stroke={color ? color : theme.black} strokeWidth="1">
        <rect width={width - 7} height={height - 6} stroke="none" fill={'#fff'}/>
        <rect x="0.5" y="0.5" width={width - 8} height={height - 7} fill="white"/>
      </g>
    </g>
  </Svg>
)

export class DimensionalBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      width: 0,
      height: 0,
    }
  }

  componentDidMount() {
    const height = this.divElement.clientHeight + 7
    const width = this.divElement.clientWidth
    this.setState({height})
    this.setState({width})

  }

  onResize = (width, height) => {
    console.log(width)
    console.log(height)
    this.setState({height: height + 7})
    this.setState({width: width})
  }
  render() {
    let {rootCss, width, maxWidth, color, children, handleHeight} = this.props
    let fixedWidth = width

    return (
      <ReactResizeDetector handleWidth handleHeight={handleHeight} onResize={this.onResize} render={({ width, height }) => (
        <Box rootCss={rootCss} width={fixedWidth} maxWidth={maxWidth} ref={(divElement) => this.divElement = divElement}>
          <SvgBox width={fixedWidth ? fixedWidth : this.state.width + 7} height={this.state.height} color={color}/>
          {children}
        </Box>
      )}>
      </ReactResizeDetector>
    );
  }
}
