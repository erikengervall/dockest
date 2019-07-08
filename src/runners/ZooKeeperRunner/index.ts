import ConfigurationError from '../../errors/ConfigurationError'
import RunnerLogger from '../../loggers/RunnerLogger'
import { validateConfig, validateTypes } from '../../utils'
import { BaseRunner, GetComposeService, Runner } from '../@types'
import { DEFAULT_CONFIG_VALUES } from '../constants'
import { getDependsOn, getImage, getPorts } from '../utils'

interface RequiredConfigProps {
  service: string
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
}
type ZooKeeperRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_PORT = '2181'
const DEFAULT_CONFIG: DefaultableConfigProps = {
  commands: DEFAULT_CONFIG_VALUES.COMMANDS,
  connectionTimeout: DEFAULT_CONFIG_VALUES.CONNECTION_TIMEOUT,
  dependsOn: DEFAULT_CONFIG_VALUES.DEPENDS_ON,
  host: DEFAULT_CONFIG_VALUES.HOST,
  image: DEFAULT_CONFIG_VALUES.IMAGE,
  ports: {
    [DEFAULT_PORT]: DEFAULT_PORT,
  },
}

class ZooKeeperRunner implements BaseRunner {
  public static DEFAULT_HOST: string = DEFAULT_CONFIG_VALUES.HOST
  public static DEFAULT_PORT: string = DEFAULT_PORT
  public runnerConfig: ZooKeeperRunnerConfig
  public runnerLogger: RunnerLogger
  public containerId: string

  constructor(config: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.runnerLogger = new RunnerLogger(this)
    this.containerId = ''

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
        `Could not resolve required environment variable ZOOKEEPER_CLIENT_PORT. Expected ${DEFAULT_PORT} to appear as value in ports object`
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
