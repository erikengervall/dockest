import PostgresExec from '../execs/postgresExecs'
import { IRunner } from './index'

export interface IPostgresRunnerConfig {
  label: string // Used for getting containerId using --filter
  service: string // dockest-compose service name
  commands?: string[] // Run custom scripts (migrate/seed)
  connectionTimeout?: number
  responsivenessTimeout?: number
  // Connection
  host: string
  db: string
  port: number
  password: string
  username: string
}

export class PostgresRunner implements IRunner {
  public containerId?: string
  public config: IPostgresRunnerConfig
  public postgresExec: PostgresExec

  constructor(config: IPostgresRunnerConfig) {
    this.config = config
    this.postgresExec = new PostgresExec()
  }

  public setup = async () => {
    const containerId = await this.postgresExec.start(this.config)
    this.containerId = containerId

    await this.postgresExec.checkConnection(this.config)
    await this.postgresExec.checkResponsiveness(containerId, this.config)
  }

  public teardown = async () => this.postgresExec.teardown(this.containerId)

  public getHelpers = async () => ({
    clear: () => true,
    loadData: () => true,
  })
}

export default PostgresRunner
