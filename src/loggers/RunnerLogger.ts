import BaseLogger, { logMethod } from './BaseLogger'

class RunnerLogger extends BaseLogger {
  public static setRunnerKey = (runnerKey: string) => {
    RunnerLogger.runnerKey = `${runnerKey}: `
  }

  private static runnerLoggerInstance: RunnerLogger
  private static runnerKey: string = ''

  constructor() {
    super()
    return RunnerLogger.runnerLoggerInstance || (RunnerLogger.runnerLoggerInstance = this)
  }

  /**
   * Setup
   */
  public setup: logMethod = () =>
    this.IS_NORMAL() && this.logLoading(`${RunnerLogger.runnerKey}Setup initiated`)

  public setupSuccess: logMethod = () =>
    this.IS_NORMAL() && this.logSuccess(`${RunnerLogger.runnerKey}Setup successful`)

  public startContainer: logMethod = () =>
    this.IS_NORMAL() && this.logLoading(`${RunnerLogger.runnerKey}Starting container`)

  public startContainerSuccess: logMethod = () =>
    this.IS_NORMAL() && this.logSuccess(`${RunnerLogger.runnerKey}Container running`)

  public checkHealth: logMethod = () =>
    this.IS_NORMAL() && this.logLoading(`${RunnerLogger.runnerKey}Healthchecking container`)

  public checkHealthSuccess: logMethod = () =>
    this.IS_NORMAL() && this.logSuccess(`${RunnerLogger.runnerKey}Healthcheck successful`)

  public checkResponsiveness = (timeout: number) =>
    this.IS_VERBOSE() &&
    this.logLoading(
      `${RunnerLogger.runnerKey}Checking container's responsiveness (Timeout in: ${timeout}s)`
    )

  public checkResponsivenessSuccess: logMethod = () =>
    this.IS_VERBOSE() &&
    this.logSuccess(`${RunnerLogger.runnerKey}Container's responsiveness checked`)

  public checkConnection = (timeout: number) =>
    this.IS_VERBOSE() &&
    this.logLoading(
      `${RunnerLogger.runnerKey}Checking container's connection (Timeout in: ${timeout}s)`
    )

  public checkConnectionSuccess: logMethod = () =>
    this.IS_VERBOSE() && this.logSuccess(`${RunnerLogger.runnerKey}Container's connection checked`)

  /**
   * Teardown
   */
  public teardown: logMethod = () =>
    this.IS_NORMAL() && this.logLoading(`${RunnerLogger.runnerKey}Container being teared down`)

  public teardownSuccess: logMethod = () =>
    this.IS_NORMAL() && this.logSuccess(`${RunnerLogger.runnerKey}Container teared down`)

  public stopContainer: logMethod = () =>
    this.IS_VERBOSE() && this.logLoading(`${RunnerLogger.runnerKey}Container being stopped`)

  public stopContainerSuccess: logMethod = () =>
    this.IS_VERBOSE() && this.logSuccess(`${RunnerLogger.runnerKey}Container stopped`)

  public removeContainer: logMethod = () =>
    this.IS_VERBOSE() && this.logLoading(`${RunnerLogger.runnerKey}Container being removed`)

  public removeContainerSuccess: logMethod = () =>
    this.IS_VERBOSE() && this.logSuccess(`${RunnerLogger.runnerKey}Container removed`)

  /**
   * Misc
   */
  public shellCmd: logMethod = (logData = '') =>
    this.IS_VERBOSE() && this.logInfo(`Executed following shell script`, this.trim(logData))
}

const runnerLogger = new RunnerLogger()
export default runnerLogger
export { RunnerLogger }
