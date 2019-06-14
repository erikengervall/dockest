import {
  DEFAULT_CONNECTION_TIMEOUT,
  DEFAULT_HOST,
  DEFAULT_RESPONSIVENESS_TIMEOUT,
} from '../../constants'
import { getImage, validateConfig, validateTypes } from '../../utils'
import BaseRunner, { runnerMethods } from '../BaseRunner'
import { Runner } from '../index'

interface RequiredConfigProps {
  service: string
}
interface DefaultableConfigProps {
  host: string
  port: number
  password: string
  dependsOn: Runner[]
  commands: string[]
  connectionTimeout: number
  responsivenessTimeout: number
}
export type RedisRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_PORT: number = 6379
const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: DEFAULT_HOST,
  port: DEFAULT_PORT,
  password: '',
  dependsOn: [],
  commands: [],
  connectionTimeout: DEFAULT_CONNECTION_TIMEOUT,
  responsivenessTimeout: DEFAULT_RESPONSIVENESS_TIMEOUT,
}

class RedisRunner extends BaseRunner {
  public runnerConfig: RedisRunnerConfig
  public runnerMethods: runnerMethods

  constructor(config: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    super()

    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.runnerMethods = {
      getComposeService: this.getComposeService,
      createResponsivenessCheckCmd: this.createResponsivenessCheckCmd,
    }

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

/**
 * DEPRECATED
 */
// const getComposeRunCommand = (runnerConfig: RedisRunnerConfig) => {
//   const { port, service, password } = runnerConfig

//   const portMapping = ` \
//                   --publish ${port}:${DEFAULT_PORT} \
//                 `
//   const cmd = ` \
//                 ${defaultDockerComposeRunOpts} \
//                 ${portMapping} \
//                 ${service} \
//                 ${!!password ? `--requirepass ${password}` : ''} \
//               `

//   return trimmer(cmd)
// }
