import { ConfigurationError } from '../../errors'
import Dockest from '../../index'
import { IBaseRunner } from '../index'
import { runCustomCommand, validateTypes } from '../utils'
import RedixExec from './execs'

export interface IRedisRunnerConfig {
  service: string
  host: string
  port: number
  password: string
  commands: string[]
  connectionTimeout: number
  responsivenessTimeout: number
}

const DEFAULT_CONFIG = {
  service: 'redis',
  host: 'localhost',
  port: 6379,
  commands: [],
  connectionTimeout: 3,
  responsivenessTimeout: 10,
}

export class RedisRunner implements IBaseRunner {
  public static getHelpers = () => {
    Dockest.jestEnv = true

    return {
      runHelpCmd: async (cmd: string) => runCustomCommand(RedisRunner.name, cmd),
    }
  }

  public config: IRedisRunnerConfig
  public redisExec: RedixExec
  public containerId: string = ''
  public runnerKey: string = ''

  constructor(config: IRedisRunnerConfig) {
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
    const schema = {
      service: validateTypes.isString,
      host: validateTypes.isString,
      port: validateTypes.isNumber,
      commands: validateTypes.isArrayOfType(validateTypes.isString),
      connectionTimeout: validateTypes.isNumber,
      responsivenessTimeout: validateTypes.isNumber,
    }

    const failures = validateTypes(schema, this.config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }
  }
}

export default RedisRunner
