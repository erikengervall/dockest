import { DockestConfig } from '..'
import Logger from '../Logger'

export default (config: DockestConfig) => {
  Logger.logLevel = config.opts.logLevel
}
