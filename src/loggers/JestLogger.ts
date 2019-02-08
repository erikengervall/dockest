import BaseLogger, { logMethod } from './BaseLogger'

class JestLogger extends BaseLogger {
  private static jestLoggerInstance: JestLogger

  constructor() {
    super()
    return JestLogger.jestLoggerInstance || (JestLogger.jestLoggerInstance = this)
  }

  public success: logMethod = m => this.IS_ERROR() && this.logSuccess(m)

  public failed: logMethod = m => this.IS_ERROR() && this.logError(m)

  public error: logMethod = (m, e) => this.IS_NORMAL() && this.logError(m, e)
}

const jestLogger = new JestLogger()
export default jestLogger
