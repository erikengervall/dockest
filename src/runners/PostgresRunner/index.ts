import { ConfigurationError } from '../../errors'
import Dockest from '../../index'
import { IBaseRunner } from '../index'
import { runCustomCommand, validateTypes } from '../utils'
import PostgresExec from './execs'

export interface IPostgresRunnerConfig {
  service: string
  host: string
  database: string
  port: number
  password: string
  username: string
  commands: string[]
  connectionTimeout: number
  responsivenessTimeout: number
}

const DEFAULT_CONFIG = {
  service: 'postgres',
  host: 'localhost',
  database: 'database',
  port: 5432,
  password: 'password',
  username: 'username',
  commands: [],
  connectionTimeout: 3,
  responsivenessTimeout: 10,
}

export class PostgresRunner implements IBaseRunner {
  public static getHelpers = () => {
    Dockest.jestEnv = true

    return {
      runHelpCmd: async (cmd: string) => runCustomCommand(PostgresRunner.name, cmd),
    }
  }

  public config: IPostgresRunnerConfig
  public postgresExec: PostgresExec
  public containerId: string = ''
  public runnerKey: string = ''

  constructor(config: IPostgresRunnerConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.postgresExec = new PostgresExec()

    this.validateConfig()
  }

  public setRunnerKey = (runnerKey: string) => {
    this.runnerKey = runnerKey
  }

  public setup = async (runnerKey: string) => {
    this.runnerKey = runnerKey

    const containerId = await this.postgresExec.start(this.config, runnerKey)
    this.containerId = containerId

    await this.postgresExec.checkHealth(this.config, containerId, runnerKey)

    const commands = this.config.commands || []
    for (const cmd of commands) {
      await runCustomCommand(runnerKey, cmd)
    }
  }

  public teardown = async () => this.postgresExec.teardown(this.containerId, this.runnerKey)

  private validateConfig = () => {
    const schema = {
      service: validateTypes.isString,
      host: validateTypes.isString,
      database: validateTypes.isString,
      port: validateTypes.isNumber,
      password: validateTypes.isString,
      username: validateTypes.isString,
    }

    const failures = validateTypes(schema, this.config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }
  }
}

export default PostgresRunner
