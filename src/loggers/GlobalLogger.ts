import BaseLogger2 from './BaseLogger2'

class GlobalLogger extends BaseLogger2 {
  private static globalLoggerInstance: GlobalLogger

  constructor() {
    super()
    return GlobalLogger.globalLoggerInstance || (GlobalLogger.globalLoggerInstance = this)
  }

  public info: any = () => ({})
}

const globalLogger = new GlobalLogger()
export default globalLogger
