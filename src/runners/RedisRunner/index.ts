import { ConfigurationError } from '../../errors'
import Dockest from '../../index'
import { BaseRunner } from '../index'
import { runCustomCommand, validateTypes } from '../utils'
import RedixExec from './execs'

interface RequiredConfigProps {
  service: string
}
interface DefaultableConfigProps {
  host: string
  port: number
  password: string
  commands: string[]
  connectionTimeout: number
  responsivenessTimeout: number
}
export type PostgresRunnerConfig = RequiredConfigProps & DefaultableConfigProps
type PostgresRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>

const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: 'localhost',
  port: 6379,
  password: '',
  commands: [],
  connectionTimeout: 3,
  responsivenessTimeout: 10,
}

export type RedisRunnerConfig = RequiredConfigProps & DefaultableConfigProps

export class RedisRunner implements BaseRunner {
  public static getHelpers = () => {
    Dockest.jestEnv = true

    return {
      runHelpCmd: async (cmd: string) => runCustomCommand(RedisRunner.name, cmd),
    }
  }

  public config: RedisRunnerConfig
  public redisExec: RedixExec
  public containerId: string = ''
  public runnerKey: string = ''

  constructor(config: PostgresRunnerConfigUserInput) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.redisExec = new RedixExec()

    this.validateConfig()
  }

  public setRunnerKey = (runnerKey: string) => {
    this.runnerKey = runnerKey
  }

  public setup = async (runnerKey: string) => {
    this.runnerKey = runnerKey

    const containerId = await this.redisExec.start(this.config, runnerKey)
    this.containerId = containerId

    await this.redisExec.checkHealth(this.config, containerId, runnerKey)

    const commands = this.config.commands || []
    for (const cmd of commands) {
      await runCustomCommand(runnerKey, cmd)
    }
  }

  public teardown = async () => this.redisExec.teardown(this.containerId, this.runnerKey)

  private validateConfig = () => {
    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }

    const failures = validateTypes(schema, this.config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }
  }
}

export default RedisRunner
