import { DEFAULT_CONNECTION_TIMEOUT, DEFAULT_HOST } from '../../constants'
import { RunnerLogger } from '../../loggers'
import { getImage, validateConfig, validateTypes } from '../../utils'
import { Runner } from '../index'

interface RequiredConfigProps {
  service: string
}
interface DefaultableConfigProps {
  host: string
  port: number
  connectionTimeout: number
  dependsOn: Runner[]
  commands: string[]
}
type ZooKeeperRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_INTERNAL_PORT: number = 2181
const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: DEFAULT_HOST,
  port: DEFAULT_INTERNAL_PORT,
  connectionTimeout: DEFAULT_CONNECTION_TIMEOUT,
  dependsOn: [],
  commands: [],
}

class ZooKeeperRunner {
  public runnerConfig: ZooKeeperRunnerConfig
  public runnerLogger: RunnerLogger
  public containerId: string

  constructor(config: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    this.runnerConfig = { ...DEFAULT_CONFIG, ...config }
    this.runnerLogger = new RunnerLogger(this)
    this.containerId = ''

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService = (dockerComposeFileName: string) => {
    const { service, port } = this.runnerConfig

    return {
      [service]: {
        image: getImage(service, dockerComposeFileName),
        ports: [`${port}:${DEFAULT_INTERNAL_PORT}`],
        environment: {
          ZOOKEEPER_CLIENT_PORT: port,
        },
      },
    }
  }
}

export { ZooKeeperRunnerConfig }
export default ZooKeeperRunner
