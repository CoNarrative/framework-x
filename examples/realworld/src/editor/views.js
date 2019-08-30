import * as R from 'ramda'
import React from 'react'
import { component, createSub } from 'framework-x'
import { getEditorErrors, getEditorForm, getEditorLoading } from './selectors'
import { evt } from '../eventTypes'
import { setKV } from '../generalEvents'
import { FormInput } from '../components/FormInput'
import { ListErrors } from '../components/ListErrors'
import { dispatch } from '../store'

const setField = k => e => dispatch(evt.SET_KV, [['editor', 'form', k], e.target.value])

const inputs = ({ title, description, body, tagInput, tagList }) => [
  { name: 'title', placeholder: 'Article Title', value: title },
  {
    name: 'description',
    className: 'form-control',
    placeholder: `What's this article about?`,
    value: description
  }, {
    name: 'body', type: 'textarea', rows: 8, className: 'form-control',
    placeholder: `What's your article about?`,
    value: body
  }, {
    name: 'tagInput', className: 'form-control', placeholder: 'Enter tags',
    value: tagInput,
    onKeyDown: e => {
      if (e.which !== 13) return
      setKV(['editor', 'form', 'tagInput'], '')
      setKV(['editor', 'form', 'tagList'], tagList.concat([tagInput]))
    }
  }]

export const Editor = component('Editor',
  createSub({ getEditorForm, getEditorErrors, getEditorLoading }),
  ({ editorForm: { tagList = [], title, description, body, tagInput }, editorErrors: errors, editorLoading: isRequestInFlight }) =>
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            {errors && <ListErrors errors={errors} />}
            <form>
              <fieldset>
                {inputs({ title, description, body, tagInput, tagList }).map((props, i) =>
                  <FormInput key={i} {...props} onChange={setField(props.name)} />)}
                <div className="tag-list">
                  {tagList.map(tag =>
                    <span key={tag} className="tag-default tag-pill">
                              <i className="ion-close-round"
                                 onClick={() => setKV(['editor', 'form', 'tagList'], R.without([tag], tagList))}>
                              </i>
                      {tag}</span>)}
                </div>
              </fieldset>
              <button type="button" className="btn btn-lg pull-xs-right btn-primary"
                      disabled={isRequestInFlight}
                      onClick={() => dispatch(evt.USER_REQUESTS_SAVE_STORY)}>
                Publish Article
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
)
