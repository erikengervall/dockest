import {
  BaseRunner,
  GetComposeService,
  Runner,
  SharedDefaultableConfigProps,
  SharedRequiredConfigProps,
} from '../@types'
import { DEFAULT_CONFIG_PROPS, SHARED_DEFAULT_CONFIG_PROPS } from '../constants'
import { ObjStrStr } from '../../@types'
import getDependsOn from '../utils/getDependsOn'
import getImage from '../utils/getImage'
import getPorts from '../utils/getPorts'
import Logger from '../../Logger'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'

type RequiredConfigProps = {
  database: string
  password: string
  username: string
} & SharedRequiredConfigProps

type DefaultableConfigProps = {
  commands: string[]
  connectionTimeout: number
  dependsOn: Runner[]
  host: string
  image: string | undefined
  ports: ObjStrStr
  responsivenessTimeout: number
} & SharedDefaultableConfigProps

type PostgresRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_PORT = '5432'
const DEFAULT_CONFIG: DefaultableConfigProps = {
  ...SHARED_DEFAULT_CONFIG_PROPS,
  commands: DEFAULT_CONFIG_PROPS.COMMANDS,
  connectionTimeout: DEFAULT_CONFIG_PROPS.CONNECTION_TIMEOUT,
  dependsOn: DEFAULT_CONFIG_PROPS.DEPENDS_ON,
  host: DEFAULT_CONFIG_PROPS.HOST,
  image: DEFAULT_CONFIG_PROPS.IMAGE,
  ports: { [DEFAULT_PORT]: DEFAULT_PORT },
  responsivenessTimeout: DEFAULT_CONFIG_PROPS.RESPONSIVENESS_TIMEOUT,
}

class PostgresRunner implements BaseRunner {
  public static DEFAULT_HOST = DEFAULT_CONFIG_PROPS.HOST
  public static DEFAULT_PORT = DEFAULT_PORT
  public containerId = ''
  public initializer = ''
  public runnerConfig: PostgresRunnerConfig
  public logger: Logger

  public constructor(configUserInput: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...configUserInput,
    }
    this.logger = new Logger(this)

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

export { PostgresRunnerConfig }
export default PostgresRunner
