import BaseLogger, { logMethod } from './BaseLogger'

class GlobalLogger extends BaseLogger {
  private static globalLoggerInstance: GlobalLogger

  constructor() {
    super()

    return GlobalLogger.globalLoggerInstance || (GlobalLogger.globalLoggerInstance = this)
  }

  public error: logMethod = (message, logData) =>
    this.LOG_LEVEL_ERROR() && this.logError(message, logData)

  /**
   * Dockest
   */
  public info: logMethod = (m, d) => this.LOG_LEVEL_VERBOSE() && this.logInfo(m, d)

  public loading: logMethod = (m, d) => this.LOG_LEVEL_NORMAL() && this.logLoading(m, d)

  /**
   * Utils
   */
  public sleepWithLog: logMethod = (reason, progress) =>
    this.LOG_LEVEL_VERBOSE() && this.logLoading(`${reason || 'Sleeping'}: ${progress}`)

  /**
   * Jest
   */
  public jestSuccess: logMethod = m => this.LOG_LEVEL_ERROR() && this.logSuccess(m)

  public jestFailed: logMethod = m => this.LOG_LEVEL_ERROR() && this.logError(m)

  public jestError: logMethod = (m, e) => this.LOG_LEVEL_NORMAL() && this.logError(m, e)

  /**
   * Execa
   */
  public shellCmd = (logData = '') =>
    this.LOG_LEVEL_VERBOSE() && this.logLoading(`Executing shell script:`, this.trim(logData))

  public shellCmdSuccess = (logData = '') =>
    this.LOG_LEVEL_VERBOSE() &&
    this.logSuccess(`Executed shell script with result:`, this.trim(logData))
}

const singleton = new GlobalLogger()
export default singleton
