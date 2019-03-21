import BaseLogger from './BaseLogger'

class RunnerLogger extends BaseLogger {
  private static runnerLoggerInstance: RunnerLogger

  constructor() {
    super()

    return RunnerLogger.runnerLoggerInstance || (RunnerLogger.runnerLoggerInstance = this)
  }

  /**
   * Setup
   */
  public setup = () => this.LOG_LEVEL_NORMAL() && this.logLoading(`Setup initiated`)

  public setupSuccess = () => this.LOG_LEVEL_NORMAL() && this.logSuccess(`Setup successful`)

  public startContainer = () => this.LOG_LEVEL_NORMAL() && this.logLoading(`Starting container`)

  public startContainerSuccess = () =>
    this.LOG_LEVEL_NORMAL() && this.logSuccess(`Container running`)

  public checkHealth = () => this.LOG_LEVEL_NORMAL() && this.logLoading(`Healthchecking container`)

  public checkHealthSuccess = () =>
    this.LOG_LEVEL_NORMAL() && this.logSuccess(`Healthcheck successful`)

  public checkResponsiveness = (timeout: number) =>
    this.LOG_LEVEL_VERBOSE() &&
    this.logLoading(`Checking container's responsiveness (Timeout in: ${timeout}s)`)

  public checkResponsivenessSuccess = () =>
    this.LOG_LEVEL_VERBOSE() && this.logSuccess(`Container's responsiveness checked`)

  public checkConnection = (timeout: number, port: string, host: number) =>
    this.LOG_LEVEL_VERBOSE() &&
    this.logLoading(`Checking container's connection (${host}:${port}) (Timeout in: ${timeout}s)`)

  public checkConnectionSuccess = () =>
    this.LOG_LEVEL_VERBOSE() && this.logSuccess(`Container's connection checked`)

  /**
   * Teardown
   */
  public teardown = () => this.LOG_LEVEL_NORMAL() && this.logLoading(`Container being teared down`)

  public teardownSuccess = () => this.LOG_LEVEL_NORMAL() && this.logSuccess(`Container teared down`)

  public stopContainer = () =>
    this.LOG_LEVEL_VERBOSE() && this.logLoading(`Container being stopped`)

  public stopContainerSuccess = () =>
    this.LOG_LEVEL_VERBOSE() && this.logSuccess(`Container stopped`)

  public removeContainer = () =>
    this.LOG_LEVEL_VERBOSE() && this.logLoading(`Container being removed`)

  public removeContainerSuccess = () =>
    this.LOG_LEVEL_VERBOSE() && this.logSuccess(`Container removed`)

  /**
   * Misc
   */
  public shellCmd = (logData = '') =>
    this.LOG_LEVEL_VERBOSE() &&
    this.logLoading(`Executing following shell script`, this.trim(logData))

  public shellCmdSuccess = (logData = '') =>
    this.LOG_LEVEL_VERBOSE() &&
    this.logSuccess(`Executed shell script with result`, this.trim(logData))
}

const singleton = new RunnerLogger()
export { RunnerLogger }
export default singleton
