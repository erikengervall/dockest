import { ConfigurationError } from 'src/errors'
import { runnerLogger, RunnerLogger } from 'src/loggers'
import { checkConnection, checkResponsiveness, start, teardown } from 'src/runners/execs'
import { RunnerConfigs } from 'src/runners/index'
import { runCustomCommand, validateTypes } from 'src/runners/utils'

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
    RunnerLogger.setRunnerKey(runnerKey)

    this.execOpts.runnerKey = runnerKey
    runnerLogger.setup(this.execOpts.runnerKey)

    const containerId = await start(this.runnerConfig, this.execOpts)
    this.execOpts.containerId = containerId

    await checkResponsiveness(this.runnerConfig, this.execOpts)
    await checkConnection(this.runnerConfig, this.execOpts)

    const commands = this.runnerConfig.commands || []
    for (const cmd of commands) {
      await runCustomCommand(this.execOpts.runnerKey, cmd)
    }

    runnerLogger.setupSuccess(this.execOpts.runnerKey)
  }

  public teardown = () => teardown(this.execOpts)
}
