import { Runner } from '../runners/index'
import BaseLogger, { logMethod } from './BaseLogger'

class RunnerLogger extends BaseLogger {
  constructor(runner: Runner) {
    super(runner)
  }

  /**
   * Setup
   */
  public runnerSetup = () => this.LOG_LEVEL_NORMAL() && this.logLoading(`Setup initiated`)

  public runnerSetupSuccess = () => this.LOG_LEVEL_NORMAL() && this.logSuccess(`Setup successful`)

  public resolveContainerId = () =>
    this.LOG_LEVEL_NORMAL() && this.logLoading(`Attempting to resolve containerId`)

  public resolveContainerIdSuccess = (containerId: string) =>
    this.LOG_LEVEL_NORMAL() && this.logSuccess(`containerId: ${containerId}`)

  public checkHealth = () => this.LOG_LEVEL_NORMAL() && this.logLoading(`Healthchecking container`)

  public checkHealthSuccess = () =>
    this.LOG_LEVEL_NORMAL() && this.logSuccess(`Healthcheck successful`)

  public checkResponsiveness = (timeout: number) =>
    this.LOG_LEVEL_VERBOSE() &&
    this.logLoading(`Checking container's responsiveness (Timeout in: ${timeout}s)`)

  public checkResponsivenessSuccess = () =>
    this.LOG_LEVEL_VERBOSE() && this.logSuccess(`Container's responsiveness checked`)

  public checkConnection = (timeout: number, host: string, port: number) =>
    this.LOG_LEVEL_VERBOSE() &&
    this.logLoading(`Checking container's connection (${host}:${port}) (Timeout in: ${timeout}s)`)

  public checkConnectionSuccess = () =>
    this.LOG_LEVEL_VERBOSE() && this.logSuccess(`Container's connection checked`)

  /**
   * Teardown
   */
  public teardownSingle = () =>
    this.LOG_LEVEL_NORMAL() && this.logLoading(`Container being teared down`)

  public teardownSingleSuccess = () =>
    this.LOG_LEVEL_NORMAL() && this.logSuccess(`Container teared down`)

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

  public customShellCmd: logMethod = cmd =>
    this.LOG_LEVEL_NORMAL() && this.logLoading(`Executed custom command`, cmd)

  public customShellCmdSuccess: logMethod = logData =>
    this.LOG_LEVEL_NORMAL() &&
    this.logSuccess(`Executed custom command successfully with result\n`, logData)
}

export default RunnerLogger
