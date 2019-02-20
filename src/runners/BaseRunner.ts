import { ConfigurationError } from '../errors'
import { RunnerLogger } from '../loggers'
import BaseExec from './BaseExec'
import { RunnerConfigs } from './index'
import { runCustomCommand, validateTypes } from './utils'

type CommandCreators = {
  createStartCommand: (runnerConfig: any) => string // TODO: no-any
  createCheckResponsivenessCommand?: (runnerConfig: any, execOpts: ExecOpts) => string // TODO: no-any
}

export type ExecOpts = {
  commandCreators: CommandCreators
  containerId: string
  runnerKey: string
}

export default class BaseRunner {
  public runnerConfig: RunnerConfigs
  public execOpts: ExecOpts
  public exec: any

  constructor(runnerConfig: RunnerConfigs, commandCreators: CommandCreators) {
    this.runnerConfig = runnerConfig
    this.execOpts = {
      commandCreators,
      containerId: '',
      runnerKey: '',
    }
    this.exec = new BaseExec()
  }

  public validateConfig = (schema: { [key: string]: any }, config: RunnerConfigs) => {
    const failures = validateTypes(schema, config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }
  }

  public setup = async (runnerKey: string) => {
    this.execOpts.runnerKey = runnerKey
    RunnerLogger.setup(this.execOpts.runnerKey)

    const containerId = await this.exec.start(this.runnerConfig, this.execOpts)
    this.execOpts.containerId = containerId

    await this.exec.checkHealth(this.runnerConfig, this.execOpts)

    const commands = this.runnerConfig.commands || []
    for (const cmd of commands) {
      await runCustomCommand(this.execOpts.runnerKey, cmd)
    }

    RunnerLogger.setupSuccess(this.execOpts.runnerKey)
  }

  public teardown = async () => {
    return this.exec.teardown(this.execOpts)
  }
}
