class BaseLogger {
  private static baseLoggerInstance: BaseLogger

  constructor() {
    return BaseLogger.baseLoggerInstance || (BaseLogger.baseLoggerInstance = this)
  }
}

export default BaseLogger
