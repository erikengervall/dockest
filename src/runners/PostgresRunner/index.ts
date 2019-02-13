import { ConfigurationError } from '../../errors'
import Dockest from '../../index'
import { BaseRunner } from '../index'
import { runCustomCommand, validateTypes } from '../utils'
import PostgresExec from './execs'

interface RequiredConfigProps {
  service: string
  database: string
  username: string
  password: string
}
interface DefaultableConfigProps {
  host: string
  port: number
  commands: string[]
  connectionTimeout: number
  responsivenessTimeout: number
}
export type PostgresRunnerConfig = RequiredConfigProps & DefaultableConfigProps
type PostgresRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>

const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: 'localhost',
  port: 5432,
  commands: [],
  connectionTimeout: 3,
  responsivenessTimeout: 10,
}

export class PostgresRunner implements BaseRunner {
  public static getHelpers = () => {
    Dockest.jestEnv = true

    return {
      runHelpCmd: async (cmd: string) => runCustomCommand(PostgresRunner.name, cmd),
    }
  }

  public config: PostgresRunnerConfig
  public postgresExec: PostgresExec
  public containerId: string = ''
  public runnerKey: string = ''

  constructor(config: PostgresRunnerConfigUserInput) {
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
    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
      database: validateTypes.isString,
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
