import {createSelector} from "@reduxjs/toolkit"
import activeTabSelect from "../Tab/activeTabSelect"
import {paginate} from "./paginate"

export const getValues = activeTabSelect((t) => {
  return t.results.values
})

export const getShapes = activeTabSelect((t) => {
  return t.results.shapes
})

export const getStatus = activeTabSelect((t) => {
  return t.results.status
})

export const getPaginatedQuery = activeTabSelect((t) => {
  if (t.results.aggregation) {
    return paginate(t.results.query, t.results.aggregationLimit, 1)
  } else {
    return paginate(t.results.query, t.results.perPage, t.results.page)
  }
})

export const getQuery = activeTabSelect((t) => {
  return t.results.query
})

export const isFetching = activeTabSelect((t) => {
  return t.results.status === "FETCHING"
})

export const isLimited = activeTabSelect((t) => {
  return t.results.status === "LIMIT"
})

export const isComplete = activeTabSelect(
  (t) => t.results.status === "COMPLETE"
)

export const isIncomplete = activeTabSelect(
  (t) => t.results.status === "INCOMPLETE"
)

export const getKey = activeTabSelect((t) => {
  return t.results.key
})

export const getAggregationLimit = activeTabSelect((t) => {
  return t.results.aggregationLimit
})

export const getError = activeTabSelect((t) => t.results.error)
export const getPage = activeTabSelect((t) => t.results.page)
export const getPerPage = activeTabSelect((t) => t.results.perPage)
export const getCount = createSelector(getValues, (values) => values.length)
