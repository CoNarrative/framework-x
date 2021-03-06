import React from 'react'
import { regFx, createStore, createSub } from 'framework-x'
import { SECTION_NAME } from './constants'
import { ErrorScreen } from './components/ErrorScreen'
import { openEditors } from './event/selectors'
import { evt } from './eventTypes'
import { Provider } from './context/Provider'
import { component } from './context/component'
import * as R from 'ramda'
import { getAcc, getEnv, getError } from './selectors'
import { getRelevantOrdinalSections, sectionMap, sections } from './sections'
import { prettyStr } from './util'
import './index.css'
import * as editor from 'monaco-editor/esm/vs/editor/editor.api'

self.MonacoEnvironment = {
  getWorkerUrl: function (moduleId, label) {
    switch (label) {
      case 'json':
        return require('blob-url-loader?type=application/javascript!compile-loader?target=worker&emit=false!monaco-editor/esm/vs/language/json/json.worker')
      case 'css':
        return require('blob-url-loader?type=application/javascript!compile-loader?target=worker&emit=false!monaco-editor/esm/vs/language/css/css.worker')
      case 'html':
        return require('blob-url-loader?type=application/javascript!compile-loader?target=worker&emit=false!monaco-editor/esm/vs/language/html/html.worker')
      case 'typescript':
      case 'javascript':
        return require('blob-url-loader?type=application/javascript!compile-loader?target=worker&emit=false!monaco-editor/esm/vs/language/typescript/ts.worker')
      default:
        return require('blob-url-loader?type=application/javascript!compile-loader?target=worker&emit=false!monaco-editor/esm/vs/editor/editor.worker')
    }
  }
}


const keyCodeAsDigit = keyCode => {
  if (keyCode < 48 || keyCode > 57) {
    return null
  }
  return keyCode - 48
}

const Root = component('Root', createSub({
  getEnv,
  getAcc,
  getError
}), ({ env, acc, error, dispatch }) => {
  if (!error || !error.data) return null
  return (
    <div className={'framework-x-error-tools'}>
      <ErrorScreen {...{ env, acc, error, dispatch }} />
    </div>
  )
})


const regErrorScreenFx = ({ regFx, regEventFx }) => {
  regEventFx(evt.INCOMING_ERROR, (_, { env, acc, error }) => {
    const ros = getRelevantOrdinalSections({ env, acc, error }, sections)
    const sectionOrdinal = R.map(
      R.prop('ordinal'),
      R.indexBy(R.prop('name'), ros))

    const ordinalSection = R.invertObj(sectionOrdinal)
    return [['db', { env, acc, error, sectionOrdinal, ordinalSection }]]
  })
  regFx('evalClosure', (env, f) => f())
  regEventFx(evt.RESET, () => [['db', {}]])
  regEventFx(evt.SKIP_EFFECT, ({ db }) => {
    const { env, acc } = db
    return [
      ['dispatch', [evt.RESET]],
      ['evalClosure', () => {
        acc.queue.shift()
        env.fx.resume(env, acc, acc)
      }]]
  })

  regEventFx(evt.RETRY_EVENT, ({ db }, event) => {
    const { env } = db
    return [
      ['dispatch', [evt.RESET]],
      ['evalClosure', () => {
        env.fx.dispatch(env, event)
      }]]
  })
  regEventFx(evt.RETRY_EVENT_WITH_EDIT, ({ db }, event) => {
    const { env } = db
    let eventVector
    try {
      eventVector = JSON.parse(event)
    } catch (e) {
      return [
        ['db', R.assocPath(['edit', 'event', 'error'],
          { type: 'json/parse', message: e.message })]]
    }

    return [
      ['dispatch', [evt.DISCARD_EDIT, [SECTION_NAME.CURRENT_EVENT]]],
      ['dispatch', [evt.RESET]],
      ['evalClosure', () => {
        env.fx.dispatch(env, eventVector)
      }]]
  })
  regEventFx(evt.START_EDIT, ({ db }, [key, value]) => {
    const s = prettyStr(value)
    return [['db', R.pipe(
      R.assocPath(['edit', key], { initialValue: s, value: s }),
      R.assocPath(['openEditors', key], true))
    ]]
  })
  regEventFx(evt.UPDATE_EDIT, ({ db }, [key, value]) => {
    return [['db', R.assocPath(['edit', key], { value })]]
  })
  regEventFx(evt.DISCARD_EDIT, ({ db }, [key]) => {
    return [['db', R.pipe(R.dissocPath(['edit', key]), R.dissocPath(['openEditors', key]))]]
  })

  // may be  faster to delegate/dispatch here to a hash map. as it stands now this calls all other keydown handlers
  // which may be slower and duplicate some logic about what key was pressed
  regEventFx(evt.KEYDOWN, (_, { keyCode }) => ({ db: R.assoc('keyDown', keyCode) }))

  // start edit on press 0-9
  // TODO.  "close" editor or "open" editor with some unused modifier key + 0-9
  regEventFx(evt.KEYDOWN, ({ db }, e) => {
      // if (!e.ctrlKey || !e.metaKey) return
      const digit = keyCodeAsDigit(e.keyCode)
      if (digit === null) return
      const os = R.prop('ordinalSection', db)
      const sectionName = os[digit]
      const section = sectionMap[sectionName]
      const onKeyDown = section && section.onAssignedOrdinalKeyDown
      if (!onKeyDown) return
      const effects = section.onAssignedOrdinalKeyDown(db)
      if (!effects) return
      e.stopPropagation()
      e.preventDefault()
      e = null
      return effects
    }
  )
}

export const createErrorTools = (env) => {
  const { env: exEnv, dispatch, setState, getState, subscribeToState, regFx: regFxLocal, regEventFx } = createStore()
  window.addEventListener('keydown', e => dispatch(evt.KEYDOWN, e))
  regErrorScreenFx({ regEventFx, regFx: regFxLocal })
  regFx(env, 'handleError', (env, acc, e) => {
    if (e.isResumable && env.errorFx && env.errorFx[e.name]) {
      env.errorFx[e.name](env, acc, e)
      return
    }
    if (e.namespace !== 'framework-x') {
      throw e
    }
    dispatch(evt.INCOMING_ERROR, { env, acc, error: e })
  })

  return {
    FrameworkXErrorTools: () =>
      <Provider {...{ dispatch, getState, subscribeToState }}>
        <Root />
      </Provider>
  }
}



