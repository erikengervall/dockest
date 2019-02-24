import BaseLogger, { logMethod } from './BaseLogger'

class GlobalLogger extends BaseLogger {
  private static globalLoggerInstance: GlobalLogger

  constructor() {
    super()
    return GlobalLogger.globalLoggerInstance || (GlobalLogger.globalLoggerInstance = this)
  }

  public error: logMethod = (message, logData) =>
    this.LOG_LEVEL_ERROR && this.logError(message, logData)

  /**
   * Dockest
   */
  public info: logMethod = (m, d) => this.LOG_LEVEL_VERBOSE && this.logInfo(m, d)

  public loading: logMethod = (m, d) => this.LOG_LEVEL_NORMAL && this.logLoading(m, d)
}

const globalLogger = new GlobalLogger()
export default globalLogger
