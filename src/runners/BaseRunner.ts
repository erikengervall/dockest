import { ConfigurationError } from '../errors'
import { RunnerLogger } from '../loggers'
import { checkHealth, start, teardown } from './BaseExec'
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

  constructor(runnerConfig: RunnerConfigs, commandCreators: CommandCreators) {
    this.runnerConfig = runnerConfig
    this.execOpts = {
      commandCreators,
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

  public setup = async (runnerKey: string) => {
    this.execOpts.runnerKey = runnerKey
    RunnerLogger.setup(this.execOpts.runnerKey)

    const containerId = await start(this.runnerConfig, this.execOpts)
    this.execOpts.containerId = containerId

    await checkHealth(this.runnerConfig, this.execOpts)

    const commands = this.runnerConfig.commands || []
    for (const cmd of commands) {
      await runCustomCommand(this.execOpts.runnerKey, cmd)
    }

    RunnerLogger.setupSuccess(this.execOpts.runnerKey)
  }

  public teardown = async () => {
    return teardown(this.execOpts)
  }
}
