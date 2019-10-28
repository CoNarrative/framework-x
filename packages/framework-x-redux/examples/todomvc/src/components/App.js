import React from 'react'
import { ADD_TODO } from '../constants/ActionTypes'
import Header from '../containers/Header'
import MainSection from '../containers/MainSection'
import { createSub } from 'framework-x'
import { component } from 'framework-x-redux'

const evt = { FLIP_COOL: 'cool/toggle' }

const CoolOMeter = component('CoolOMeter', createSub({
  cool: x => {
    console.log('coolsub',x)
    return x.cool === true
  }
}), ({ x, cool, dispatch }) => {
  console.log('rendering', { cool }, x, dispatch)
  return (
    <div onClick={() => dispatch(evt.FLIP_COOL, {value: !cool})}>
      Hello {String(cool)}
    </div>
  )
})

const App = () => (
  <div>
    <CoolOMeter />
    <Header />
    <MainSection />
  </div>
)

export default App
