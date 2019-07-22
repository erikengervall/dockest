import { DockestConfig } from '..'
import { LOG_SYMBOLS } from '../constants'
import hashCode from '../utils/hashCode'

export default (config: DockestConfig) => {
  config.runners.forEach(({ logger, runnerConfig: { service } }) => {
    const serviceHash = Math.abs(hashCode(service))

    logger.setRunnerSymbol(LOG_SYMBOLS[serviceHash % LOG_SYMBOLS.length])
  })
}
