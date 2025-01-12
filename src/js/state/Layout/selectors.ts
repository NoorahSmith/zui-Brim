import {createSelector} from "@reduxjs/toolkit"
import activeTabSelect from "../Tab/activeTabSelect"
import {MAIN_RESULTS} from "../Results/types"
import {getShapes} from "../Results/selectors"

const getResultsView = activeTabSelect((s) => s.layout.resultsView)

const getEffectiveResultsView = createSelector(
  getResultsView,
  getShapes(MAIN_RESULTS),
  (view, shapes) => {
    const isSingleShape = Object.values(shapes).length === 1
    if (isSingleShape) return view
    else return "INSPECTOR"
  }
)

export default {
  getDetailPaneWidth: activeTabSelect(
    (state) => state.layout.rightSidebarWidth
  ),
  getDetailPaneIsOpen: activeTabSelect(
    (state) => state.layout.rightSidebarIsOpen
  ),
  getResultsView,
  getEffectiveResultsView,
  getCurrentPaneName: activeTabSelect((state) => state.layout.currentPaneName),
  getColumnsView: activeTabSelect((state) => state.layout.columnHeadersView),
  getIsEditingTitle: activeTabSelect((s) => s.layout.isEditingTitle),
  getTitleFormAction: activeTabSelect((s) => s.layout.titleFormAction),
  getShowHistogram: activeTabSelect((s) => s.layout.showHistogram ?? true),
}
