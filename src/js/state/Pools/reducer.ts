import {createSlice, PayloadAction as PA} from "@reduxjs/toolkit"
import {Pool} from "src/app/core/pools/pool"
import {get, set, unset} from "lodash"
import {PoolConfig, PoolStats} from "@brimdata/zed-js"

const slice = createSlice({
  initialState: {} as {[lakeId: string]: {[poolId: string]: Pool}},
  name: "$POOLS_",
  reducers: {
    appendWarning: (
      state,
      action: PA<{lakeId: string; poolId: string; warning: string}>
    ) => {
      const {lakeId, poolId, warning} = action.payload
      const warnings = get(state, [lakeId, poolId, "warnings"], [])
      set(state, [lakeId, poolId, "warnings"], [...warnings, warning])
    },

    clearWarnings: (state, action: PA<{lakeId: string; poolId: string}>) => {
      const {lakeId, poolId} = action.payload
      unset(state, [lakeId, poolId, "warnings"])
    },

    setData: (state, action: PA<{lakeId: string; data: PoolConfig}>) => {
      const {lakeId, data} = action.payload
      set(state, [lakeId, data.id, "data"], data)
    },

    setStats: (
      state,
      action: PA<{lakeId: string; poolId: string; stats: PoolStats}>
    ) => {
      const {lakeId, poolId, stats} = action.payload
      set(state, [lakeId, poolId, "stats"], stats)
    },

    setAllData: (
      state,
      action: PA<{lakeId: string; allData: PoolConfig[]}>
    ) => {
      const {lakeId, allData} = action.payload
      const prev = get(state, [lakeId], {})

      state[lakeId] = allData.reduce((all, data) => {
        all[data.id] = prev[data.id] || {}
        all[data.id].data = data
        return all
      }, {})
    },

    remove: (state, action: PA<{lakeId: string; poolId: string}>) => {
      const {lakeId, poolId} = action.payload
      unset(state, [lakeId, poolId])
    },

    removeAll: (state, action: PA<string>) => {
      state[action.payload] = {}
    },
  },
})

export const reducer = slice.reducer
export const actions = slice.actions
