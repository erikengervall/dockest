import Logger from '../../Logger'
import validateConfig from '../../utils/validateConfig'
import validateTypes from '../../utils/validateTypes'
import { BaseRunner, GetComposeService, SharedRequiredConfigProps, SharedDefaultableConfigProps } from '../@types'
import { DEFAULT_CONFIG_PROPS, SHARED_DEFAULT_CONFIG_PROPS } from '../constants'
import getDependsOn from '../utils/getDependsOn'
import getImage from '../utils/getImage'
import getPorts from '../utils/getPorts'

interface RequiredConfigProps extends SharedRequiredConfigProps {} // eslint-disable-line
interface DefaultableConfigProps extends SharedDefaultableConfigProps {
  password: string
  responsivenessTimeout: number
}
interface RedisRunnerConfig extends RequiredConfigProps, DefaultableConfigProps {}

const DEFAULT_PORT = '6379'
const DEFAULT_CONFIG: DefaultableConfigProps = {
  ...SHARED_DEFAULT_CONFIG_PROPS,
  password: '',
  ports: {
    [DEFAULT_PORT]: DEFAULT_PORT,
  },
  responsivenessTimeout: DEFAULT_CONFIG_PROPS.RESPONSIVENESS_TIMEOUT,
}

class RedisRunner implements BaseRunner {
  public static DEFAULT_HOST = SHARED_DEFAULT_CONFIG_PROPS.host
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
    const { dependsOn, image, ports, props, service } = this.runnerConfig

    return {
      [service]: {
        ...getDependsOn(dependsOn),
        ...getImage({ image, composeFileName, props, service }),
        ...getPorts(ports),
        ...props, // FIXME: Would love to type this stronger
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
