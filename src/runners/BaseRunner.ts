import { BaseLogger, runnerLogger } from '../loggers'
import { RunnerConfigs } from './index'
import {
  checkConnection,
  checkResponsiveness,
  resolveContainerId,
  runCustomCommand,
  teardownSingle,
} from './utils'

type runnerCommandFactories = {
  getComposeService: (runnerConfig: any, dockerComposeFileName: string) => any // FIXME: no-any
  createCheckResponsivenessCommand?: (runnerConfig: any, execOpts: ExecOpts) => string // FIXME: no-any
}

export type ExecOpts = {
  runnerCommandFactories: runnerCommandFactories
  containerId: string
  runnerKey: string
}

class BaseRunner {
  public runnerConfig: RunnerConfigs
  public execOpts: ExecOpts

  constructor(runnerConfig: RunnerConfigs, runnerCommandFactories: runnerCommandFactories) {
    this.runnerConfig = runnerConfig
    this.execOpts = {
      runnerCommandFactories,
      containerId: '',
      runnerKey: '',
    }
  }

  public setupStarted = (): void => {
    runnerLogger.runnerSetup()
  }

  public resolveRunTimeParameters = async (runnerKey: string): Promise<void> => {
    // set runnerKey
    BaseLogger.runnerKey = `${runnerKey}: ` // FIXME: Consider initializing a logger per runner instead
    this.execOpts.runnerKey = runnerKey

    // set containerId
    const containerId = await resolveContainerId(this.runnerConfig)
    this.execOpts.containerId = containerId
  }

  public performHealthchecks = async (): Promise<void> => {
    await checkConnection(this.runnerConfig)
    await checkResponsiveness(this.runnerConfig, this.execOpts)
  }

  public runCustomCommands = async (): Promise<void> => {
    const commands = this.runnerConfig.commands || []

    for (const cmd of commands) {
      await runCustomCommand(this.execOpts.runnerKey, cmd)
    }
  }

  public setupCompleted = (): void => {
    runnerLogger.runnerSetupSuccess()

    BaseLogger.runnerKey = ''
  }

  public teardown = async () => {
    const { containerId, runnerKey } = this.execOpts

    await teardownSingle(containerId, runnerKey)
  }
}

export default BaseRunner
