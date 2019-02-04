// tslint:disable:no-console

import { LOG_LEVEL } from '../constants'
import Dockest from '../index'
import BaseLogger, { logMethod } from './BaseLogger'

const logLevel = Dockest ? Dockest.config.dockest.logLevel : LOG_LEVEL.VERBOSE

const trim = (str: string = ''): string => str.replace(/\s+/g, ' ').trim()

const handleLogData = (logData?: any) => {
  if (typeof logData === 'string') {
    return trim(logData)
  }

  return logData
}

class GlobalLogger extends BaseLogger {
  private static globalLoggerInstance: GlobalLogger
  constructor() {
    super()
    if (GlobalLogger.globalLoggerInstance) {
      return GlobalLogger.globalLoggerInstance
    }

    GlobalLogger.globalLoggerInstance = this
  }

  public verbose: logMethod = (m, d = '') => logLevel >= LOG_LEVEL.VERBOSE && this.logInfo(m, d)

  public loading: logMethod = (m, d = '') => logLevel >= LOG_LEVEL.NORMAL && this.logLoading(m, d)

  public success: logMethod = (message, logData = '') =>
    logLevel >= LOG_LEVEL.ERROR && this.logSuccess(`${message}`, logData)

  public error: logMethod = (message, logData = '') =>
    logLevel >= LOG_LEVEL.ERROR && this.logError(message, logData)

  public shellCmd: logMethod = (logData = '') =>
    logLevel >= LOG_LEVEL.VERBOSE &&
    this.logVerbose(`Executed following shell script`, handleLogData(logData))

  public jestFailed: logMethod = (message, logData = '') =>
    logLevel >= LOG_LEVEL.ERROR && this.logError(message, logData)

  public jestSuccess: logMethod = message => logLevel >= LOG_LEVEL.ERROR && this.logSuccess(message)
}

const globalLogger = new GlobalLogger()
export default globalLogger
