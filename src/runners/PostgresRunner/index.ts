import { RunnerLogger } from '../../loggers'
import { getDependsOn, getImage, getPorts, validateConfig, validateTypes } from '../../utils'
import { GetComposeService, Runner } from '../@types'
import { DEFAULT_CONFIG_VALUES } from '../constants'

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
  ports: {
    [key: string]: string
  }
  responsivenessTimeout: number
}
export type PostgresRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_PORT = '5432'
const DEFAULT_CONFIG: DefaultableConfigProps = {
  commands: DEFAULT_CONFIG_VALUES.COMMANDS,
  connectionTimeout: DEFAULT_CONFIG_VALUES.CONNECTION_TIMEOUT,
  dependsOn: DEFAULT_CONFIG_VALUES.DEPENDS_ON,
  host: DEFAULT_CONFIG_VALUES.HOST,
  image: DEFAULT_CONFIG_VALUES.IMAGE,
  ports: {
    [DEFAULT_PORT]: DEFAULT_PORT,
  },
  responsivenessTimeout: DEFAULT_CONFIG_VALUES.RESPONSIVENESS_TIMEOUT,
}

class PostgresRunner {
  public static DEFAULT_HOST: string = DEFAULT_CONFIG_VALUES.HOST
  public static DEFAULT_PORT: string = DEFAULT_PORT
  public containerId: string
  public runnerConfig: PostgresRunnerConfig
  public runnerLogger: RunnerLogger

  constructor(configUserInput: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    this.containerId = ''
    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...configUserInput,
    }
    this.runnerLogger = new RunnerLogger(this)

    // TODO: Can this type be generalized and receive RequiredConfigProps as an argument?
    const schema: { [key in keyof RequiredConfigProps]: () => void } = {
      database: validateTypes.isString,
      password: validateTypes.isString,
      service: validateTypes.isString,
      username: validateTypes.isString,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService: GetComposeService = composeFileName => {
    const { database, dependsOn, image, password, ports, service, username } = this.runnerConfig

    return {
      [service]: {
        environment: {
          POSTGRES_DB: database,
          POSTGRES_PASSWORD: password,
          POSTGRES_USER: username,
        },
        ...getDependsOn(dependsOn),
        ...getImage({ image, composeFileName, service }),
        ...getPorts(ports),
      },
    }
  }

  public createResponsivenessCheckCmd = () => {
    const { host, database, username } = this.runnerConfig
    const containerId = this.containerId
    const command = ` \
                      docker exec ${containerId} \
                      bash -c "psql \
                      -h ${host} \
                      -d ${database} \
                      -U ${username} \
                      -c 'select 1'" \
                    `

    return command
  }
}

export default PostgresRunner
