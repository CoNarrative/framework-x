import { derive } from 'framework-x'
import { SECTION_NAME } from './constants'
import { initialEditedEventValue, openEditors } from './event/selectors'
import { evt } from './eventTypes'
import { getCaughtEffect, getCaughtEvent } from './selectors'
import * as R from 'ramda'
import { mapIndexed } from './util'

export const sections = [
  {
    name: SECTION_NAME.CURRENT_EVENT,
    precondition: [getCaughtEvent],
    onAssignedOrdinalKeyDown: derive([openEditors, initialEditedEventValue], (editors, initialValue) => {
      if (!R.path([SECTION_NAME.CURRENT_EVENT], editors)) {
        //start edit
        return [['dispatch', [evt.START_EDIT, [SECTION_NAME.CURRENT_EVENT, initialValue]]]]
      }
    })
  },
  {
    name: SECTION_NAME.CURRENT_EFFECT,
    precondition: [getCaughtEffect],
  },
]

export const getRelevantOrdinalSections = (db, sections) =>
  mapIndexed((x, i) => R.assoc('ordinal', i, x),
    R.filter(a => R.allPass(R.prop('precondition', a), db), sections)
  )

export const sectionMap = R.indexBy(R.prop('name'), sections)
