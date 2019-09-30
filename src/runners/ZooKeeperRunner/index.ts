import {
  BaseRunner,
  GetComposeService,
  SharedDefaultableConfigProps,
  SharedRequiredConfigProps,
  ComposeService,
} from '../@types'
import { SHARED_DEFAULT_CONFIG_PROPS } from '../constants'
import ConfigurationError from '../../errors/ConfigurationError'
import Logger from '../../Logger'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'
import composeFileHelper from '../composeFileHelper'

interface RequiredConfigProps extends SharedRequiredConfigProps {
  service: string
}
interface DefaultableConfigProps extends SharedDefaultableConfigProps {}
interface ZooKeeperRunnerConfig extends RequiredConfigProps, DefaultableConfigProps {}

const DEFAULT_PORT = 2181
const DEFAULT_CONFIG: DefaultableConfigProps = {
  ...SHARED_DEFAULT_CONFIG_PROPS,
  ports: [
    {
      published: DEFAULT_PORT,
      target: DEFAULT_PORT,
    },
  ],
}

class ZooKeeperRunner implements BaseRunner {
  public static DEFAULT_HOST = SHARED_DEFAULT_CONFIG_PROPS.host
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
    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService: GetComposeService = () => {
    const { ports } = this.runnerConfig

    const zookeeperClientPortBinding = ports.find(portBinding => portBinding.target === DEFAULT_PORT)
    if (!zookeeperClientPortBinding) {
      throw new ConfigurationError(
        `Could not resolve required environment variable ZOOKEEPER_CLIENT_PORT. Expected ${DEFAULT_PORT} to appear as value in ports object`,
      )
    }

    return {
      environment: {
        ZOOKEEPER_CLIENT_PORT: zookeeperClientPortBinding.target,
      },
      ...composeFileHelper(this.runnerConfig),
    }
  }
}

export { ZooKeeperRunnerConfig }
export default ZooKeeperRunner
