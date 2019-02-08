import BaseLogger, { logMethod } from './BaseLogger'

class ExecLogger extends BaseLogger {
  private static execLoggerInstance: ExecLogger

  constructor() {
    super()
    return ExecLogger.execLoggerInstance || (ExecLogger.execLoggerInstance = this)
  }

  /**
   * Setup
   */
  public setup: logMethod = runnerKey =>
    this.IS_NORMAL() && this.logLoading(`${runnerKey}: Setup initiated`)

  public setupSuccess: logMethod = runnerKey =>
    this.IS_NORMAL() && this.logSuccess(`${runnerKey}: Setup successful`)

  public startContainer: logMethod = runnerKey =>
    this.IS_NORMAL() && this.logLoading(`${runnerKey}: Starting container`)

  public startContainerSuccess: logMethod = runnerKey =>
    this.IS_NORMAL() && this.logSuccess(`${runnerKey}: Container running`)

  public checkHealth: logMethod = runnerKey =>
    this.IS_NORMAL() && this.logLoading(`${runnerKey}: Healthchecking container`)

  public checkHealthSuccess: logMethod = runnerKey =>
    this.IS_NORMAL() && this.logSuccess(`${runnerKey}: Healthcheck successful`)

  public checkResponsiveness = (runnerKey: string, timeout: number) =>
    this.IS_VERBOSE() &&
    this.logLoading(`${runnerKey}: Checking container's responsiveness (Timeout in: ${timeout}s)`)

  public checkResponsivenessSuccess: logMethod = runnerKey =>
    this.IS_VERBOSE() && this.logSuccess(`${runnerKey}: Container's responsiveness checked`)

  public checkConnection = (runnerKey: string, timeout: number) =>
    this.IS_VERBOSE() &&
    this.logLoading(`${runnerKey}: Checking container's connection (Timeout in: ${timeout}s)`)

  public checkConnectionSuccess: logMethod = runnerKey =>
    this.IS_VERBOSE() && this.logSuccess(`${runnerKey}: Container's connection checked`)

  /**
   * Teardown
   */
  public teardown: logMethod = runnerKey =>
    this.IS_NORMAL() && this.logLoading(`${runnerKey}: Container being teared down`)

  public teardownSuccess: logMethod = runnerKey =>
    this.IS_NORMAL() && this.logSuccess(`${runnerKey}: Container teared down`)

  public stopContainer: logMethod = runnerKey =>
    this.IS_VERBOSE() && this.logLoading(`${runnerKey}: Container being stopped`)

  public stopContainerSuccess: logMethod = runnerKey =>
    this.IS_VERBOSE() && this.logSuccess(`${runnerKey}: Container stopped`)

  public removeContainer: logMethod = runnerKey =>
    this.IS_VERBOSE() && this.logLoading(`${runnerKey}: Container being removed`)

  public removeContainerSuccess: logMethod = runnerKey =>
    this.IS_VERBOSE() && this.logSuccess(`${runnerKey}: Container removed`)

  /**
   * Misc
   */
  public shellCmd: logMethod = (logData = '') =>
    this.IS_VERBOSE() && this.logInfo(`Executed following shell script`, this.trim(logData))
}

const execLogger = new ExecLogger()
export default execLogger
