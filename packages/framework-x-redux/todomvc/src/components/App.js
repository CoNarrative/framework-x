import React from 'react'
import { ADD_TODO } from '../constants/ActionTypes'
import Header from '../containers/Header'
import MainSection from '../containers/MainSection'
import { createSub } from 'framework-x'
import { component } from 'framework-x-redux'

const Foo = component('Foo', createSub({ x: x => 42 }), ({ x, dispatch }) => {
  return (
    <div onClick={() => dispatch(ADD_TODO, { text: 'hi' })}>
      Hello
    </div>
  )
})

const App = () => (
  <div>
    <Foo cool={true} />
    <Header />
    <MainSection />
  </div>
)

export default App
