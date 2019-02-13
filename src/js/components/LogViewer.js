/* @flow */

import React from "react"

import {XPhonyViewer} from "./Viewer/PhonyViewer"
import Chunker from "./Viewer/Chunker"
import {type Layout as LayoutInterface, create} from "./Viewer/Layout"
import Log from "../models/Log"
import LogRow from "./LogRow"
import TableLayout from "../models/TableLayout"
import Viewer from "./Viewer/Viewer"

type Props = {
  height: number,
  width: number,
  logs: Log[],
  selectedLog: ?Log,
  timeZone: string,
  columns: TableLayout,
  atEnd: boolean,
  onLastChunk?: Function,
  onRowClick?: Function
}

type State = {
  selectedIndex: ?number
}

export default class LogViewer extends React.Component<Props, State> {
  state = {selectedIndex: null}

  createLayout() {
    return create({
      height: this.props.height,
      width: this.props.width,
      size: this.props.logs.length,
      rowH: 25,
      columns: this.props.columns
    })
  }

  createChunker() {
    return new Chunker({
      size: this.props.logs.length,
      height: this.props.height,
      rowHeight: 25,
      chunkSize: 5,
      overScan: 3
    })
  }

  renderRow = (index: number, layout: LayoutInterface) => {
    return (
      <LogRow
        columns={this.props.columns.getColumns()}
        key={index}
        index={index}
        log={this.props.logs[index]}
        timeZone={this.props.timeZone}
        highlight={Log.isSame(this.props.logs[index], this.props.selectedLog)}
        layout={layout}
        onClick={() => {
          this.props.onRowClick && this.props.onRowClick(index)
        }}
      />
    )
  }

  render() {
    if (this.props.logs.length === 0) return null
    return (
      <div>
        <XPhonyViewer />
        <Viewer
          columns={this.props.columns.getColumns()}
          logs={this.props.logs}
          layout={this.createLayout()}
          chunker={this.createChunker()}
          onLastChunk={this.props.onLastChunk}
          rowRenderer={this.renderRow}
          selectedLog={this.props.selectedLog}
          atEnd={this.props.atEnd}
        />
      </div>
    )
  }
}
