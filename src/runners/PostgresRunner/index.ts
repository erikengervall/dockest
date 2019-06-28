import { DEFAULT_CONFIG_VALUES } from '../../constants'
import { RunnerLogger } from '../../loggers'
import { getImage, validateConfig, validateTypes } from '../../utils'
import { GetComposeService, Runner } from '../@types'

interface RequiredConfigProps {
  database: string
  password: string
  service: string
  username: string
}
interface DefaultableConfigProps {
  commands: string[]
  connectionTimeout: number
  dependsOn: Runner[]
  host: string
  image: string | undefined
  port: number
  responsivenessTimeout: number
}
export type PostgresRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_PORT: number = 5432
const DEFAULT_CONFIG: DefaultableConfigProps = {
  commands: [],
  connectionTimeout: DEFAULT_CONFIG_VALUES.CONNECTION_TIMEOUT,
  dependsOn: [],
  host: DEFAULT_CONFIG_VALUES.HOST,
  image: undefined,
  port: DEFAULT_PORT,
  responsivenessTimeout: DEFAULT_CONFIG_VALUES.RESPONSIVENESS_TIMEOUT,
}

class PostgresRunner {
  public runnerConfig: PostgresRunnerConfig
  public runnerLogger: RunnerLogger
  public containerId: string

  constructor(configUserInput: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    this.runnerConfig = { ...DEFAULT_CONFIG, ...configUserInput }
    this.runnerLogger = new RunnerLogger(this)
    this.containerId = ''

    // TODO: Can this type be generalized and receive RequiredConfigProps as an argument?
    const schema: { [key in keyof RequiredConfigProps]: () => void } = {
      database: validateTypes.isString,
      password: validateTypes.isString,
      service: validateTypes.isString,
      username: validateTypes.isString,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService: GetComposeService = dockerComposeFileName => {
    const { image, password, username, database, port, service } = this.runnerConfig

    return {
      [service]: {
        image: getImage({ image, dockerComposeFileName, service }),
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
