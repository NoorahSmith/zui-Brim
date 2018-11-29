/* @flow */
import React from "react"
import Chunker from "./Chunker"
import type {Layout} from "./Layout"
import type {RowRenderer} from "./types"

type Props = {
  rowRenderer: RowRenderer,
  chunker: Chunker,
  isScrolling: boolean,
  chunk: number,
  layout: Layout
}

export default class Chunk extends React.PureComponent<Props> {
  getRows() {
    return this.props.chunker.rows(this.props.chunk)
  }

  render() {
    const {rowRenderer, isScrolling, layout} = this.props
    return (
      <div>
        {this.getRows().map(index => rowRenderer(index, isScrolling, layout))}
      </div>
    )
  }
}
