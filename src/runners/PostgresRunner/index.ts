import {
  BaseRunner,
  GetComposeService,
  SharedDefaultableConfigProps,
  SharedRequiredConfigProps,
  ComposeService,
} from '../@types'
import { SHARED_DEFAULT_CONFIG_PROPS } from '../constants'
import Logger from '../../Logger'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'
import composeFileHelper from '../composeFileHelper'

interface RequiredConfigProps extends SharedRequiredConfigProps {
  database: string
  password: string
  username: string
}
interface DefaultableConfigProps extends SharedDefaultableConfigProps {
  responsivenessTimeout: number
}
interface PostgresRunnerConfig extends RequiredConfigProps, DefaultableConfigProps {}

const DEFAULT_PORT = 5432
const DEFAULT_CONFIG: DefaultableConfigProps = {
  ...SHARED_DEFAULT_CONFIG_PROPS,
  ports: [
    {
      target: DEFAULT_PORT,
      published: DEFAULT_PORT,
    },
  ],
  responsivenessTimeout: SHARED_DEFAULT_CONFIG_PROPS.responsivenessTimeout,
}

class PostgresRunner implements BaseRunner {
  public static DEFAULT_HOST = SHARED_DEFAULT_CONFIG_PROPS.host
  public static DEFAULT_PORT = DEFAULT_PORT
  public static ENVIRONMENT_DATABASE = 'POSTGRES_DB'
  public static ENVIRONMENT_PASSWORD = 'POSTGRES_PASSWORD'
  public static ENVIRONMENT_USERNAME = 'POSTGRES_USER'
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
  }

  public mergeConfig({ ports, build, image, networks, ...composeService }: ComposeService) {
    this.runnerConfig = {
      ...this.runnerConfig,
      ...composeService,
      ...(image ? { image } : {}),
      ...(build ? { build } : {}),
      ...(ports ? { ports } : {}),
      ...(networks ? { networks: Object.keys(networks) } : {}),
    }
  }

  public validateConfig() {
    // TODO: Can this type be generalized and receive RequiredConfigProps as an argument?
    const schema: { [key in keyof RequiredConfigProps]: () => void } = {
      database: validateTypes.isString,
      password: validateTypes.isString,
      service: validateTypes.isString,
      username: validateTypes.isString,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService: GetComposeService = () => {
    const { database, password, username } = this.runnerConfig

    return {
      environment: {
        [PostgresRunner.ENVIRONMENT_DATABASE]: database,
        [PostgresRunner.ENVIRONMENT_PASSWORD]: password,
        [PostgresRunner.ENVIRONMENT_USERNAME]: username,
      },
      ...composeFileHelper(this.runnerConfig),
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
