import {
  BaseRunner,
  GetComposeService,
  Runner,
  SharedDefaultableConfigProps,
  SharedRequiredConfigProps,
} from '../@types'
import { DEFAULT_CONFIG_PROPS, SHARED_DEFAULT_CONFIG_PROPS } from '../constants'
import { ObjStrStr } from '../../@types'
import ConfigurationError from '../../errors/ConfigurationError'
import getDependsOn from '../utils/getDependsOn'
import getImage from '../utils/getImage'
import getPorts from '../utils/getPorts'
import Logger from '../../Logger'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'

interface RequiredConfigProps extends SharedRequiredConfigProps {
  service: string
}

interface DefaultableConfigProps extends SharedDefaultableConfigProps {
  commands: string[]
  connectionTimeout: number
  dependsOn: Runner[]
  host: string
  image: string | undefined
  ports: ObjStrStr
}

interface ZooKeeperRunnerConfig extends RequiredConfigProps, DefaultableConfigProps {}

const DEFAULT_PORT = '2181'
const DEFAULT_CONFIG: DefaultableConfigProps = {
  ...SHARED_DEFAULT_CONFIG_PROPS,
  commands: DEFAULT_CONFIG_PROPS.COMMANDS,
  connectionTimeout: DEFAULT_CONFIG_PROPS.CONNECTION_TIMEOUT,
  dependsOn: DEFAULT_CONFIG_PROPS.DEPENDS_ON,
  host: DEFAULT_CONFIG_PROPS.HOST,
  image: DEFAULT_CONFIG_PROPS.IMAGE,
  ports: {
    [DEFAULT_PORT]: DEFAULT_PORT,
  },
}

class ZooKeeperRunner implements BaseRunner {
  public static DEFAULT_HOST = DEFAULT_CONFIG_PROPS.HOST
  public static DEFAULT_PORT = DEFAULT_PORT
  public containerId = ''
  public initializer = ''
  public runnerConfig: ZooKeeperRunnerConfig
  public logger: Logger

  public constructor(config: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.logger = new Logger(this)

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService: GetComposeService = composeFileName => {
    const { dependsOn, image, ports, service } = this.runnerConfig

    const ZOOKEEPER_CLIENT_PORT = Object.keys(ports).find(key => ports[key] === DEFAULT_PORT)
    if (!ZOOKEEPER_CLIENT_PORT) {
      throw new ConfigurationError(
        `Could not resolve required environment variable ZOOKEEPER_CLIENT_PORT. Expected ${DEFAULT_PORT} to appear as value in ports object`,
      )
    }

    return {
      [service]: {
        environment: {
          ZOOKEEPER_CLIENT_PORT,
        },
        ...getDependsOn(dependsOn),
        ...getImage({ image, composeFileName, service }),
        ...getPorts(ports),
      },
    }
  }
}

export { ZooKeeperRunnerConfig }
export default ZooKeeperRunner
