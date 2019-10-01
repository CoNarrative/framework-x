import * as R from 'ramda'
import { derive } from 'framework-x'
import { SECTION_NAME } from '../constants'
import { getCaughtEvent } from '../selectors'
import { prettyStr } from '../util'

export const openEditors = R.path(['openEditors'])
export const isEditingEvent = derive([openEditors],R.path([SECTION_NAME.CURRENT_EVENT]))
export const getEdits = R.path(['edit'])
export const editedEvent = derive([getEdits], R.path([SECTION_NAME.CURRENT_EVENT]))
export const editedEventValue = derive([editedEvent], R.path(['value']))
export const editedEventValueStr = derive([editedEventValue], prettyStr)
export const initialEditedEventValue = getCaughtEvent
export const initialEditedEventValueStr = derive([initialEditedEventValue], prettyStr)
export const eventIsEdited = derive([editedEventValueStr, initialEditedEventValueStr],
  (a, b) => a !== b)
