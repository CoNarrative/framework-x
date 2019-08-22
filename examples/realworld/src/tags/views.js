import { component, createSub } from 'framework-x'
import React from 'react'
import { evt } from '../eventTypes'
import { getTags } from './selectors'
import { dispatch } from '../store'


const Tag = ({ tag }) =>
  <a className="tag-default tag-pill"
     onClick={e => {
       e.preventDefault()
       dispatch(evt.APPLY_TAG_FILTER, tag)
     }}>{tag}</a>

export const Tags = component('Tags', createSub({ tags: getTags }), ({ tags }) =>
  <div className="tag-list">
    {tags && tags.map((tag, i) => <Tag key={i} {...{ tag }} />)}
  </div>
)

