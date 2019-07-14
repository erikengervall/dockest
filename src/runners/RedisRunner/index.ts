import Logger from '../../Logger'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'
import { BaseRunner, GetComposeService, Runner } from '../@types'
import { DEFAULT_CONFIG_VALUES } from '../constants'
import getDependsOn from '../utils/getDependsOn'
import getImage from '../utils/getImage'
import getPorts from '../utils/getPorts'

interface RequiredConfigProps {
  service: string
}
interface DefaultableConfigProps {
  commands: string[]
  connectionTimeout: number
  dependsOn: Runner[]
  host: string
  image: string | undefined
  password: string
  ports: {
    [key: string]: string
  }
  responsivenessTimeout: number
}
export type RedisRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_PORT = '6379'
const DEFAULT_CONFIG: DefaultableConfigProps = {
  commands: DEFAULT_CONFIG_VALUES.COMMANDS,
  connectionTimeout: DEFAULT_CONFIG_VALUES.CONNECTION_TIMEOUT,
  dependsOn: DEFAULT_CONFIG_VALUES.DEPENDS_ON,
  host: DEFAULT_CONFIG_VALUES.HOST,
  image: DEFAULT_CONFIG_VALUES.IMAGE,
  password: '',
  ports: {
    [DEFAULT_PORT]: DEFAULT_PORT,
  },
  responsivenessTimeout: DEFAULT_CONFIG_VALUES.RESPONSIVENESS_TIMEOUT,
}

class RedisRunner implements BaseRunner {
  public static DEFAULT_HOST: string = DEFAULT_CONFIG_VALUES.HOST
  public static DEFAULT_PORT: string = DEFAULT_PORT
  public containerId: string
  public runnerConfig: RedisRunnerConfig
  public logger: Logger

  public constructor(config: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    this.containerId = ''
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

    return {
      [service]: {
        ...getDependsOn(dependsOn),
        ...getImage({ image, composeFileName, service }),
        ...getPorts(ports),
      },
    }
  }

  public createResponsivenessCheckCmd = () => {
    const { host: runnerHost, password: runnerPassword } = this.runnerConfig
    const containerId = this.containerId

    // FIXME: Should `-p` really be DEFAULT_PORT or runnerConfig's port?
    const redisCliPingOpts = ` \
                            -h ${runnerHost} \
                            -p ${DEFAULT_PORT} \
                            ${!!runnerPassword ? `-a ${runnerPassword}` : ''} \
                            PING \
                          `
    const command = ` \
                      docker exec ${containerId} redis-cli ${redisCliPingOpts} \
                    `

    return command
  }
}

export default RedisRunner
