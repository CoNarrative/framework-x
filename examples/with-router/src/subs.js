import { prop } from 'ramda'
import { createSelector, createStructuredSelector } from "reselect"

const getCount = prop('count') //return 0 as default!
const getFormattedCount = createSelector(getCount,
  count => (count || 0 ).toLocaleString({ minimumFractionDigits: 1 }))

export const mainSub = createStructuredSelector({
  formattedCount: getFormattedCount,
})
