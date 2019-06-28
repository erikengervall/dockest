import { DEFAULT_CONFIG_VALUES } from '../../constants'
import { RunnerLogger } from '../../loggers'
import { getImage, validateConfig, validateTypes } from '../../utils'
import { Runner } from '../@types'

interface RequiredConfigProps {
  service: string
}
interface DefaultableConfigProps {
  commands: string[]
  connectionTimeout: number
  dependsOn: Runner[]
  host: string
  image: string | undefined
  port: number
}
type ZooKeeperRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_INTERNAL_PORT: number = 2181
const DEFAULT_CONFIG: DefaultableConfigProps = {
  commands: [],
  connectionTimeout: DEFAULT_CONFIG_VALUES.CONNECTION_TIMEOUT,
  dependsOn: [],
  host: DEFAULT_CONFIG_VALUES.HOST,
  image: undefined,
  port: DEFAULT_INTERNAL_PORT,
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
    const { image, port, service } = this.runnerConfig

    return {
      [service]: {
        environment: { ZOOKEEPER_CLIENT_PORT: port },
        image: getImage({ image, dockerComposeFileName, service }),
        ports: [`${port}:${DEFAULT_INTERNAL_PORT}`],
      },
    }
  }
}

export { ZooKeeperRunnerConfig }
export default ZooKeeperRunner
