import { IBaseRunner } from '../'
import { ConfigurationError } from '../../errors'
import { getMissingProps, runCustomCommand } from '../utils'
import PostgresExec from './execs'

export interface IPostgresRunnerConfig {
  service: string
  host: string
  database: string
  port: number
  password: string
  username: string
  commands?: string[]
  connectionTimeout?: number
  responsivenessTimeout?: number
}

const DEFAULT_CONFIG = {
  commands: [],
}

export class PostgresRunner implements IBaseRunner {
  public config: IPostgresRunnerConfig
  public postgresExec: PostgresExec
  public containerId: string
  public runnerKey: string

  constructor(config: IPostgresRunnerConfig) {
    this.config = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.postgresExec = new PostgresExec()
    this.containerId = ''
    this.runnerKey = ''

    this.validateConfig()
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

  public teardown = async (runnerKey: string) =>
    this.postgresExec.teardown(this.containerId, runnerKey)

  public getHelpers = async () => ({
    clear: () => true,
    loadData: () => true,
  })

  private validateConfig = () => {
    // config
    if (!this.config) {
      throw new ConfigurationError('config')
    }

    // validate required props
    const { service, host, database, port, password, username } = this.config
    const requiredProps: { [key: string]: any } = {
      service,
      host,
      database,
      port,
      password,
      username,
    }
    const missingProps = getMissingProps(requiredProps)
    if (missingProps.length > 0) {
      throw new ConfigurationError(`${missingProps.join(', ')}`)
    }
  }
}

export default PostgresRunner
