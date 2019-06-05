import BaseLogger, { logMethod } from './BaseLogger'

class JestLogger extends BaseLogger {
  private static jestLoggerInstance: JestLogger

  constructor() {
    super()

    return JestLogger.jestLoggerInstance || (JestLogger.jestLoggerInstance = this)
  }

  public success: logMethod = m => this.LOG_LEVEL_ERROR() && this.logSuccess(m)

  public failed: logMethod = m => this.LOG_LEVEL_ERROR() && this.logError(m)

  public error: logMethod = (m, e) => this.LOG_LEVEL_NORMAL() && this.logError(m, e)
}

const singleton = new JestLogger()
export default singleton
