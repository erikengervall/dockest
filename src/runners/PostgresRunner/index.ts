import {
  DEFAULT_CONNECTION_TIMEOUT,
  DEFAULT_HOST,
  DEFAULT_RESPONSIVENESS_TIMEOUT,
} from '../../constants'
import { RunnerLogger } from '../../loggers'
import { getImage, validateConfig, validateTypes } from '../../utils'
import { Runner } from '../index'
import { GetComposeService } from '../types'

interface RequiredConfigProps {
  service: string
  database: string
  username: string
  password: string
}
interface DefaultableConfigProps {
  host: string
  port: number
  dependsOn: Runner[]
  commands: string[]
  connectionTimeout: number
  responsivenessTimeout: number
}
export type PostgresRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_PORT: number = 5432
const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: DEFAULT_HOST,
  port: DEFAULT_PORT,
  dependsOn: [],
  commands: [],
  connectionTimeout: DEFAULT_CONNECTION_TIMEOUT,
  responsivenessTimeout: DEFAULT_RESPONSIVENESS_TIMEOUT,
}

class PostgresRunner {
  public runnerConfig: PostgresRunnerConfig
  public runnerLogger: RunnerLogger
  public containerId: string

  constructor(configUserInput: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    this.runnerConfig = { ...DEFAULT_CONFIG, ...configUserInput }
    this.runnerLogger = new RunnerLogger(this)
    this.containerId = ''

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
      database: validateTypes.isString,
      password: validateTypes.isString,
      username: validateTypes.isString,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService: GetComposeService = dockerComposeFileName => {
    const { service, port, database, username, password } = this.runnerConfig

    return {
      [service]: {
        image: getImage(service, dockerComposeFileName),
        ports: [`${port}:${DEFAULT_PORT}`],
        environment: {
          POSTGRES_DB: database,
          POSTGRES_USER: username,
          POSTGRES_PASSWORD: password,
        },
      },
    }
  }

  public createResponsivenessCheckCmd = () => {
    const { host, database, username } = this.runnerConfig
    const containerId = this.containerId
    const cmd = ` \
                  docker exec ${containerId} \
                  bash -c "psql \
                  -h ${host} \
                  -d ${database} \
                  -U ${username} \
                  -c 'select 1'" \
                `

    return cmd
  }
}

export default PostgresRunner
