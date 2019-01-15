import { getContainerId } from '../execs/helpers'
import { checkPostgresResponsiveness, startPostgresContainer } from '../execs/postgres'
import { tearSingle } from '../execs/teardown'

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

export class PostgresRunner {
  public $containerId?: string
  public config: IPostgresRunnerConfig

  constructor(config: IPostgresRunnerConfig) {
    this.config = config
  }

  public async setup() {
    const containerId = await startPostgresContainer(this.config)
    this.$containerId = containerId

    await checkPostgresResponsiveness(containerId, this.config)
  }

  public async teardown() {
    tearSingle(this.$containerId)
  }

  public async getHelpers() {
    return {
      clear: () => true,
      loadData: () => true,
    }
  }
}

export default PostgresRunner
