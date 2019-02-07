// tslint:disable
console.log('WHAT')

import BaseLogger, { logMethod } from './BaseLogger'

class GlobalLogger extends BaseLogger {
  private static globalLoggerInstance: GlobalLogger

  constructor() {
    super()
    return GlobalLogger.globalLoggerInstance || (GlobalLogger.globalLoggerInstance = this)
  }

  // Dockest
  public info: logMethod = (m, d) => this.IS_VERBOSE() && this.logInfo(m, d)

  // Dockest
  public loading: logMethod = (m, d) => this.IS_NORMAL() && this.logLoading(m, d)

  public error: logMethod = (message, logData) => this.IS_ERROR() && this.logError(message, logData)
}

const globalLogger = new GlobalLogger()
export default globalLogger
