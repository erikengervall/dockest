import Logger from '../../Logger'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'
import {
  Runner,
  BaseRunner,
  GetComposeService,
  SharedRequiredConfigProps,
  SharedDefaultableConfigProps,
} from '../@types'
import { ObjStrStr } from '../../@types'
import { DEFAULT_CONFIG_PROPS, SHARED_DEFAULT_CONFIG_PROPS } from '../constants'
import getDependsOn from '../utils/getDependsOn'
import getImage from '../utils/getImage'
import getPorts from '../utils/getPorts'

type RequiredConfigProps = {} & SharedRequiredConfigProps

type DefaultableConfigProps = {
  commands: string[]
  connectionTimeout: number
  dependsOn: Runner[]
  host: string
  image: string | undefined
  password: string
  ports: ObjStrStr
  responsivenessTimeout: number
} & SharedDefaultableConfigProps

type RedisRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_PORT = '6379'
const DEFAULT_CONFIG: DefaultableConfigProps = {
  ...SHARED_DEFAULT_CONFIG_PROPS,
  commands: DEFAULT_CONFIG_PROPS.COMMANDS,
  connectionTimeout: DEFAULT_CONFIG_PROPS.CONNECTION_TIMEOUT,
  dependsOn: DEFAULT_CONFIG_PROPS.DEPENDS_ON,
  host: DEFAULT_CONFIG_PROPS.HOST,
  image: DEFAULT_CONFIG_PROPS.IMAGE,
  password: '',
  ports: { [DEFAULT_PORT]: DEFAULT_PORT },
  responsivenessTimeout: DEFAULT_CONFIG_PROPS.RESPONSIVENESS_TIMEOUT,
}

class RedisRunner implements BaseRunner {
  public static DEFAULT_HOST = DEFAULT_CONFIG_PROPS.HOST
  public static DEFAULT_PORT = DEFAULT_PORT
  public containerId = ''
  public initializer = ''
  public runnerConfig: RedisRunnerConfig
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

export { RedisRunnerConfig }
export default RedisRunner
