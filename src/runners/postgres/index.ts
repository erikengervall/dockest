import ConfigurationError from '../../errors/ConfigurationError'
import Dockest from '../../index'
import { validateInputFields } from '../../utils'
import { IRunner } from '../types'
import PostgresExec from './execs'

export interface IPostgresRunnerConfig {
  service: string // dockest-compose service name
  host: string
  db: string
  port: number
  password: string
  username: string
  commands?: string[] // Run custom scripts (migrate/seed)
  connectionTimeout?: number
  responsivenessTimeout?: number
}

export class PostgresRunner implements IRunner {
  public containerId?: string
  public config: IPostgresRunnerConfig
  public postgresExec: PostgresExec

  constructor(config: IPostgresRunnerConfig) {
    this.validatePostgresConfig(config)
    this.config = config
    this.postgresExec = new PostgresExec()
  }

  public setup = async () => {
    const composeFile = Dockest.config.dockest.dockerComposeFilePath
    const containerId = await this.postgresExec.start(this.config, composeFile)
    this.containerId = containerId

    await this.postgresExec.checkHealth(containerId, this.config)
  }

  public teardown = async () => this.postgresExec.teardown(this.containerId)

  public getHelpers = async () => ({
    clear: () => true,
    loadData: () => true,
  })

  private validatePostgresConfig = (config: IPostgresRunnerConfig): void => {
    const { service, host, db, port, password, username } = config
    const requiredProps = { service, host, db, port, password, username }
    validateInputFields('postgres', requiredProps)

    if (!config) {
      throw new ConfigurationError('Missing configuration for Postgres runner')
    }
  }
}

export default PostgresRunner
