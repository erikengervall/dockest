import BaseLogger, { logMethod } from './BaseLogger'

class RunnerLogger extends BaseLogger {
  private static runnerLoggerInstance: RunnerLogger

  constructor() {
    super()
    return RunnerLogger.runnerLoggerInstance || (RunnerLogger.runnerLoggerInstance = this)
  }

  /**
   * Setup
   */
  public setup: logMethod = () => this.LOG_LEVEL_NORMAL && this.logLoading(`Setup initiated`)

  public setupSuccess: logMethod = () =>
    this.LOG_LEVEL_NORMAL && this.logSuccess(`Setup successful`)

  public startContainer: logMethod = () =>
    this.LOG_LEVEL_NORMAL && this.logLoading(`Starting container`)

  public startContainerSuccess: logMethod = () =>
    this.LOG_LEVEL_NORMAL && this.logSuccess(`Container running`)

  public checkHealth: logMethod = () =>
    this.LOG_LEVEL_NORMAL && this.logLoading(`Healthchecking container`)

  public checkHealthSuccess: logMethod = () =>
    this.LOG_LEVEL_NORMAL && this.logSuccess(`Healthcheck successful`)

  public checkResponsiveness = (timeout: number) =>
    this.LOG_LEVEL_VERBOSE &&
    this.logLoading(`Checking container's responsiveness (Timeout in: ${timeout}s)`)

  public checkResponsivenessSuccess: logMethod = () =>
    this.LOG_LEVEL_VERBOSE && this.logSuccess(`Container's responsiveness checked`)

  public checkConnection = (timeout: number) =>
    this.LOG_LEVEL_VERBOSE &&
    this.logLoading(`Checking container's connection (Timeout in: ${timeout}s)`)

  public checkConnectionSuccess: logMethod = () =>
    this.LOG_LEVEL_VERBOSE && this.logSuccess(`Container's connection checked`)

  /**
   * Teardown
   */
  public teardown: logMethod = () =>
    this.LOG_LEVEL_NORMAL && this.logLoading(`Container being teared down`)

  public teardownSuccess: logMethod = () =>
    this.LOG_LEVEL_NORMAL && this.logSuccess(`Container teared down`)

  public stopContainer: logMethod = () =>
    this.LOG_LEVEL_VERBOSE && this.logLoading(`Container being stopped`)

  public stopContainerSuccess: logMethod = () =>
    this.LOG_LEVEL_VERBOSE && this.logSuccess(`Container stopped`)

  public removeContainer: logMethod = () =>
    this.LOG_LEVEL_VERBOSE && this.logLoading(`Container being removed`)

  public removeContainerSuccess: logMethod = () =>
    this.LOG_LEVEL_VERBOSE && this.logSuccess(`Container removed`)

  /**
   * Misc
   */
  public shellCmd: logMethod = (logData = '') =>
    this.LOG_LEVEL_VERBOSE &&
    this.logLoading(`Executing following shell script`, this.trim(logData))

  public shellCmdSuccess: logMethod = (logData = '') =>
    this.LOG_LEVEL_VERBOSE &&
    this.logSuccess(`Executed shell script with result`, this.trim(logData))
}

const runnerLogger = new RunnerLogger()
export default runnerLogger
export { RunnerLogger }
