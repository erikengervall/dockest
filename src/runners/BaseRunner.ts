import { ConfigurationError } from '../errors'
import { BaseLogger, runnerLogger } from '../loggers'
import { RunnerConfigs } from './index'
import {
  checkConnection,
  checkResponsiveness,
  resolveContainerId,
  runCustomCommand,
  teardownSingle,
  validateTypes,
} from './utils'

type runnerCommandFactories = {
  getComposeService: (runnerConfig: any, dockerComposeFileName: string) => any // FIXME: no-any
  getComposeRunCommand?: (runnerConfig: any) => string // FIXME: no-any
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

  public validateConfig = (schema: { [key: string]: any }, config: RunnerConfigs) => {
    const failures = validateTypes(schema, config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }
  }

  public runTimeSetup = async (runnerKey: string) => {
    runnerLogger.runTimeSetup()

    // inject runtimeOpts
    BaseLogger.runnerKey = `${runnerKey}: ` // FIXME: Consider initializing a logger per runner instead
    this.execOpts.runnerKey = runnerKey

    // resolve containerIds
    const containerId = await resolveContainerId(this.runnerConfig)
    this.execOpts.containerId = containerId

    // perform healthchecks
    await checkResponsiveness(this.runnerConfig, this.execOpts)
    await checkConnection(this.runnerConfig)

    const commands = this.runnerConfig.commands || []
    for (const cmd of commands) {
      await runCustomCommand(this.execOpts.runnerKey, cmd)
    }

    runnerLogger.runTimeSetupSuccess()
    BaseLogger.runnerKey = ''
  }

  public teardown = async () => {
    const { containerId, runnerKey } = this.execOpts

    await teardownSingle(containerId, runnerKey)
  }
}

export default BaseRunner
