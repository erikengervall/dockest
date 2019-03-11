import { ConfigurationError } from '../errors'
import { BaseLogger, runnerLogger } from '../loggers'
import { RunnerConfigs } from './index'
import {
  checkConnection,
  checkResponsiveness,
  runCustomCommand,
  start,
  teardown,
  validateTypes,
} from './utils'

type CommandCreators = {
  createStartCommand: (runnerConfig: any) => string // FIXME: no-any
  createCheckResponsivenessCommand?: (runnerConfig: any, execOpts: ExecOpts) => string // FIXME: no-any
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
    BaseLogger.runnerKey = `${runnerKey}: `

    this.execOpts.runnerKey = runnerKey
    runnerLogger.setup()

    const containerId = await start(this.runnerConfig, this.execOpts)
    this.execOpts.containerId = containerId

    await checkResponsiveness(this.runnerConfig, this.execOpts)
    await checkConnection(this.runnerConfig)

    const commands = this.runnerConfig.commands || []
    for (const cmd of commands) {
      await runCustomCommand(this.execOpts.runnerKey, cmd)
    }

    runnerLogger.setupSuccess()
  }

  public teardown = () => teardown(this.execOpts)
}
