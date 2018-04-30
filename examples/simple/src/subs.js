import { prop } from 'ramda'
import { createSelector, createStructuredSelector } from "reselect"

const getCount = prop('count')
const getFormattedCount = createSelector(getCount,
  count => count.toLocaleString({ minimumFractionDigits: 1 }))

export const mainSub = createStructuredSelector({
  formattedCount: getFormattedCount,
})
