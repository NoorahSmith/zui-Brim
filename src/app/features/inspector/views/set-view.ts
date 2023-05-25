import * as zed from "@brimdata/zed-js"
import {createView} from "../views/create"
import {ContainerView} from "./container-view"

export class SetView extends ContainerView<zed.Set> {
  name() {
    return "Set"
  }

  count() {
    return this.value.items.length
  }

  openToken() {
    return "|["
  }

  closeToken() {
    return "]|"
  }

  *iterate(n?: number) {
    const items = this.value.items
    const length = n ? Math.min(n, items.length) : items.length

    for (let i = 0; i < items.length; ++i) {
      const last = i === length - 1
      yield createView({
        ...this.args,
        type: items[i].type,
        value: items[i],
        last,
        key: this.isExpanded() ? i.toString() : null,
        indexPath: [...this.args.indexPath, i],
      })
      if (last) break
    }
  }
}
