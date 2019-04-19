/* @flow */

import type {Span} from "../../BoomClient/types"
import {
  filenameCorrelation,
  md5Correlation,
  rxHostsCorrelation,
  txHostsCorrelation
} from "./programs"
import {parallelizeProcs} from "../../lib/Program"
import BaseSearch from "./BaseSearch"
import Log from "../Log"

export default class Md5Search extends BaseSearch {
  log: Log

  constructor(log: Log, span: Span) {
    super("BAD DESIGN", span)
    this.log = log
  }

  getProgram() {
    const md5 = this.log.get("md5")
    return parallelizeProcs([
      filenameCorrelation(md5),
      md5Correlation(md5),
      rxHostsCorrelation(md5),
      txHostsCorrelation(md5)
    ])
  }
}
