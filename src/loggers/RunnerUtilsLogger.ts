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

  public sleepWithLog: logMethod = (reason, progress) =>
    this.LOG_LEVEL_VERBOSE() && this.logLoading(`${reason || 'Sleeping'}: ${progress}`)

  public customShellCmd: logMethod = (runnerKey, cmd) =>
    this.LOG_LEVEL_NORMAL() && this.logLoading(`${runnerKey}: Executed custom command`, cmd)

  public customShellCmdSuccess: logMethod = (runnerKey, logData) =>
    this.LOG_LEVEL_NORMAL() &&
    this.logSuccess(`${runnerKey}: Executed custom command successfully with result\n`, logData)

  public shellCmd: logMethod = (logData = '') =>
    this.LOG_LEVEL_VERBOSE() &&
    this.logLoading(`Executing following shell script`, this.trim(logData))

  public shellCmdSuccess: logMethod = (logData = '') =>
    this.LOG_LEVEL_VERBOSE() &&
    this.logSuccess(`Executed shell script with result`, this.trim(logData))
}

const singleton = new RunnerUtilsLogger()
export default singleton
