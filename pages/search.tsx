import React, {useEffect, useState} from "react"
import {AppProvider} from "src/app/core/context"
import {invoke} from "src/core/invoke"
import App from "src/js/components/App"
import initialize from "src/js/initializers/initialize"
import TabHistories from "src/js/state/TabHistories"
import {getPersistedWindowState} from "src/js/state/stores/get-persistable"

export default function SearchPage() {
  const [app, setApp] = useState(null)

  useEffect(() => {
    initialize().then((vars) => {
      window.onbeforeunload = () => {
        vars.api.abortables.abortAll()
        vars.store.dispatch(TabHistories.save(global.tabHistories.serialize()))
        invoke(
          "autosaveOp",
          global.windowId,
          getPersistedWindowState(vars.store.getState())
        )
      }
      setApp(vars)
    })
  }, [])

  if (!app) return null

  return (
    <AppProvider store={app.store} api={app.api}>
      <App />
    </AppProvider>
  )
}
