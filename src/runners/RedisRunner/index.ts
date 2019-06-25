import { DEFAULT_CONFIG_VALUES } from '../../constants'
import { RunnerLogger } from '../../loggers'
import { getImage, validateConfig, validateTypes } from '../../utils'
import { Runner } from '../@types'

interface RequiredConfigProps {
  service: string
}
interface DefaultableConfigProps {
  host: string
  port: number
  password: string
  dependsOn: Runner[]
  image: string
  commands: string[]
  connectionTimeout: number
  responsivenessTimeout: number
}
export type RedisRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_PORT: number = 6379
const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: DEFAULT_CONFIG_VALUES.HOST,
  port: DEFAULT_PORT,
  password: '',
  dependsOn: [],
  image: '',
  commands: [],
  connectionTimeout: DEFAULT_CONFIG_VALUES.CONNECTION_TIMEOUT,
  responsivenessTimeout: DEFAULT_CONFIG_VALUES.RESPONSIVENESS_TIMEOUT,
}

class RedisRunner {
  public runnerConfig: RedisRunnerConfig
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
        ports: [`${port}:${DEFAULT_PORT}`],
      },
    }
  }

  public createResponsivenessCheckCmd = () => {
    const { host: runnerHost, password: runnerPassword } = this.runnerConfig
    const containerId = this.containerId

    // FIXME: Should `-p` be DEFAULT_PORT or runnerConfig's port?
    const redisCliPingOpts = ` \
                            -h ${runnerHost} \
                            -p ${DEFAULT_PORT} \
                            ${!!runnerPassword ? `-a ${runnerPassword}` : ''} \
                            PING \
                          `
    const cmd = ` \
                  docker exec ${containerId} redis-cli ${redisCliPingOpts} \
                `

    return cmd
  }
}

export default RedisRunner
