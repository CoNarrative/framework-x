import React from 'react'
import Header from '../containers/Header'
import MainSection from '../containers/MainSection'
import { createSub } from 'framework-x'
import { frameworkXRedux, makeFrameworkXMiddleware,component } from 'framework-x-redux'
window.React = React

const Foo = component("Foo",createSub({x:x=>x}),({x})=>{
  console.log('x',x)
  return <div>Hello</div>
})
const App = () => (
  <div>
    <Foo/>

    <Header />
    <MainSection />
  </div>
)

export default App
