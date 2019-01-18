import { ConfigurationError } from '../../errors'
import Dockest from '../../index'
import { validateInputFields } from '../../utils/config'
import { runCustomCommand } from '../../utils/execs'
import { IRunner } from '../types'
import PostgresExec from './execs'

export interface IPostgresRunnerConfig {
  service: string // dockest-compose service name
  host: string
  database: string
  port: number
  password: string
  username: string
  commands?: string[] // Run custom scripts (migrate/seed)
  connectionTimeout?: number
  responsivenessTimeout?: number
}

const DEFAULT_CONFIG = {
  commands: [],
}

export class PostgresRunner implements IRunner {
  public containerId?: string
  public config: IPostgresRunnerConfig
  public postgresExec: PostgresExec

  constructor(config: IPostgresRunnerConfig) {
    this.validatePostgresConfig(config)
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.postgresExec = new PostgresExec()
  }

  public setup = async () => {
    const composeFile = Dockest.config.dockest.dockerComposeFilePath
    const containerId = await this.postgresExec.start(this.config, composeFile)
    this.containerId = containerId

    await this.postgresExec.checkHealth(containerId, this.config)

    const commands = this.config.commands || []
    for (const cmd of commands) {
      await runCustomCommand(cmd)
    }
  }

  public teardown = async () => this.postgresExec.teardown(this.containerId)

  public getHelpers = async () => ({
    clear: () => true,
    loadData: () => true,
  })

  private validatePostgresConfig = (config: IPostgresRunnerConfig): void => {
    if (!config) {
      throw new ConfigurationError('Missing configuration for Postgres runner')
    }

    const { service, host, database, port, password, username } = config
    const requiredProps = { service, host, database, port, password, username }
    validateInputFields('postgres', requiredProps)
  }
}

export default PostgresRunner
