import {matchPath} from "react-router"
import {createSelector} from "reselect"
import brim, {BrimLake} from "../../brim"
import Pools from "../Pools"
import {PoolsState} from "../Pools/types"
import Tabs from "../Tabs"
import {State} from "../types"
import Lakes from "../Lakes"
import {LakesState} from "../Lakes/types"
import {MemoryHistory} from "history"
import {Pool} from "src/app/core/pools/pool"
import DraftQueries from "../DraftQueries"
import RemoteQueries from "../RemoteQueries"
import Queries from "../Queries"
import {BrimQuery} from "src/app/query-home/utils/brim-query"
import {Query} from "../Queries/types"

type Id = string | null

export const getHistory = (
  state,
  windowName = global.windowName
): MemoryHistory => {
  const id = Tabs.getActive(state)
  if (windowName === "search") return global.tabHistories.getOrCreate(id)
  if (windowName === "detail" || windowName === "hidden")
    return global.windowHistory
  throw new Error("Unknown Window Name (must be search or detail)")
}

export const getLocation = (state: State) => {
  return getHistory(state)?.location
}

export const getQueryLocationData = (
  state: State
): {queryId: string | null} => {
  type Params = {queryId?: string}
  const match = matchPath<Params>(getLocation(state).pathname, [
    "/lakes/:lakeId/queries/:queryId",
  ])
  const queryId = match?.params?.queryId
  return {queryId}
}

const getRawQuery = (state: State): Query | null => {
  const {queryId} = getQueryLocationData(state)
  if (!queryId) return null
  // query lookup policy is to search drafts first, then local, and finally remote
  const query =
    DraftQueries.getById(queryId)(state) ||
    Queries.getQueryById(queryId)(state) ||
    RemoteQueries.getQueryById(queryId)(state)
  if (!query) return null
  return query
}

export const getQuery = createSelector<State, Query | null, BrimQuery>(
  getRawQuery,
  (query) => {
    if (!query) return null
    return new BrimQuery(query)
  }
)

export const getPoolId = (state) => {
  type Params = {poolId?: string}
  const match = matchPath<Params>(getLocation(state).pathname, [
    "/lakes/:lakeId/pools/:poolId",
  ])
  return match?.params?.poolId || null
}

export const getLakeId = (state: State = undefined) => {
  type Params = {lakeId?: string}
  const match = matchPath<Params>(getLocation(state).pathname, "/lakes/:lakeId")
  return match?.params?.lakeId || null
}

export const mustGetLake = createSelector<State, LakesState, Id, BrimLake>(
  Lakes.raw,
  getLakeId,
  (lakes, id) => {
    if (!id) throw new Error("Current lake id is unset")
    if (!lakes[id]) throw new Error(`Missing lake id: ${id}`)

    return brim.lake(lakes[id])
  }
)

export const getQueryPool = createSelector<
  State,
  PoolsState,
  Id,
  BrimQuery,
  Pool
>(Pools.raw, getLakeId, getQuery, (pools, lakeId, query) => {
  if (!lakeId || !query) return null
  const name = query.getPoolName()
  if (!name) return null
  if (!pools[lakeId]) return null

  const pool = Object.values(pools[lakeId]).find((p) => p.data.name === name)

  if (!pool) {
    console.error(`Missing pool: ${name}`)
    return null
  }

  return new Pool(pool.data, pool.stats)
})

export const mustGetPool = createSelector<State, PoolsState, Id, Id, Pool>(
  Pools.raw,
  getLakeId,
  getPoolId,
  (pools, lakeId, poolId) => {
    if (!lakeId) throw new Error("Current lake id is unset")
    if (!poolId) throw new Error("Current pool id is unset")
    if (!pools[lakeId]) {
      throw new Error(`No pools in lake id: ${lakeId}`)
    }
    if (!pools[lakeId][poolId]) throw new Error(`Missing pool id: ${poolId}`)

    const {data, stats} = pools[lakeId][poolId]
    return new Pool(data, stats)
  }
)

export const getPool = (state: State) => {
  try {
    return mustGetPool(state)
  } catch {
    return null
  }
}

export const getLake = (state: State) => {
  try {
    return mustGetLake(state)
  } catch {
    return null
  }
}

export const getPools = createSelector(getLake, Pools.raw, (l, pools) => {
  const lakePools = pools[l.id] || {}
  return Object.keys(lakePools)
    .map((id) => lakePools[id])
    .map(({data, stats}) => new Pool(data, stats))
    .sort((a, b) => (a.name > b.name ? 1 : -1))
})

export const getTabId = (s: State) => {
  return s.tabs.active
}
