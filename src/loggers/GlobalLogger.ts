import { trim } from '../utils/helpers'
import BaseLogger, { logMethod } from './BaseLogger'

class GlobalLogger extends BaseLogger {
  private static globalLoggerInstance: GlobalLogger

  constructor() {
    super()

    return GlobalLogger.globalLoggerInstance || (GlobalLogger.globalLoggerInstance = this)
  }

  public error: logMethod = (message, logData) =>
    this.LOG_LEVEL_ERROR() && this.logError(message, logData)

  public exitHandler: logMethod = (message, logData) =>
    this.LOG_LEVEL_ERROR && logData.code === 0
      ? this.logSuccess(message, logData)
      : this.logError(message, logData)

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

  public startPerf = (perfStart: number) =>
    this.LOG_LEVEL_NORMAL() && this.logInfo(`Started Dockest at ${new Date(perfStart)}`)

  public perf = (perfStart: number) => {
    if (this.LOG_LEVEL_NORMAL()) {
      const perfTime = Math.floor((Date.now() - perfStart) / 1000)
      let hours: number | string = Math.floor(perfTime / 3600)
      let minutes: number | string = Math.floor((perfTime - hours * 3600) / 60)
      let seconds: number | string = perfTime - hours * 3600 - minutes * 60

      if (hours < 10) {
        hours = `0${hours}`
      }
      if (minutes < 10) {
        minutes = `0${minutes}`
      }
      if (seconds < 10) {
        seconds = `0${seconds}`
      }

      this.logInfo(`Elapsed time: ${hours}:${minutes}:${seconds}`)
    }
  }

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
    this.LOG_LEVEL_VERBOSE() && this.logLoading(`Executing shell script:`, trim(logData))

  public shellCmdSuccess = (logData = '') =>
    this.LOG_LEVEL_VERBOSE() && this.logSuccess(`Executed shell script with result:`, trim(logData))
}

const singleton = new GlobalLogger()
export default singleton
