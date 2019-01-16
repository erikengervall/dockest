import { checkConnection, checkResponsiveness, startContainer } from '../execs/postgres'
import { tearSingle } from '../execs/teardown'
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

  constructor(config: IPostgresRunnerConfig) {
    this.config = config
  }

  public async setup() {
    const containerId = await startContainer(this.config)
    this.containerId = containerId

    await checkConnection(this.config)
    await checkResponsiveness(containerId, this.config)
  }

  public async teardown() {
    tearSingle(this.containerId)
  }

  public async getHelpers() {
    return {
      clear: () => true,
      loadData: () => true,
    }
  }
}

export default PostgresRunner
