import BaseLogger, { logMethod } from './BaseLogger'

class RunnerUtilsLogger extends BaseLogger {
  private static runnerUtilsLoggerInstance: RunnerUtilsLogger

  constructor() {
    super()
    return (
      RunnerUtilsLogger.runnerUtilsLoggerInstance ||
      (RunnerUtilsLogger.runnerUtilsLoggerInstance = this)
    )
  }

  public customShellCmd: logMethod = (runnerKey, cmd) =>
    this.IS_NORMAL() && this.logLoading(`${runnerKey}: Executed custom command`, cmd)

  public customShellCmdSuccess: logMethod = (runnerKey, logData) =>
    this.IS_NORMAL() &&
    this.logSuccess(`${runnerKey}: Executed custom command successfully with result\n`, logData)
}

const runnerUtilsLogger = new RunnerUtilsLogger()
export default runnerUtilsLogger
