import { DockestConfig } from '..'
import { LOG_SYMBOLS } from '../constants'

export default (config: DockestConfig) => {
  config.runners.forEach(({ logger }, index) => {
    logger.setRunnerSymbol(LOG_SYMBOLS[index % config.runners.length])
  })
}
