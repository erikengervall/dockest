import BaseLogger from './BaseLogger'

class GlobalLogger extends BaseLogger {
  private static globalLoggerInstance: GlobalLogger

  constructor() {
    super()
    return GlobalLogger.globalLoggerInstance || (GlobalLogger.globalLoggerInstance = this)
  }

  public info: any = () => ({})
}

const globalLogger = new GlobalLogger()
export default globalLogger
