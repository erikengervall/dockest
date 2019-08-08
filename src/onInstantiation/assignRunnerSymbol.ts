import { DockestConfig } from '../index'
import { LOG_SYMBOLS } from '../constants'
import hashCode from '../utils/hashCode'

export default (config: DockestConfig) => {
  let LOG_SYMBOLS_CLONE = LOG_SYMBOLS.slice(0)

  config.runners.forEach(({ logger, runnerConfig: { service } }) => {
    const serviceHash = Math.abs(hashCode(service))

    if (LOG_SYMBOLS_CLONE.length === 0) {
      LOG_SYMBOLS_CLONE = LOG_SYMBOLS.slice(0) // If there's not enough symbols, reinitialize the array
    }

    const index = serviceHash % LOG_SYMBOLS_CLONE.length
    const LOG_SYMBOL = LOG_SYMBOLS_CLONE.splice(index, 1)[0]

    logger.setRunnerSymbol(LOG_SYMBOL)
  })
}
