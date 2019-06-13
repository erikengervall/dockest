import BaseRunner, { runnerMethods } from '../BaseRunner'
import { createCheckResponsiveness, getImage, validateConfig, validateTypes } from '../utils'

interface RequiredConfigProps {
  service: string
}
interface DefaultableConfigProps {
  host: string
  port: number
  password: string
  commands: string[]
  connectionTimeout: number
  responsivenessTimeout: number
}
type RedisRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>
export type RedisRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const DEFAULT_INTERNAL_PORT: number = 6379
const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: 'localhost',
  port: DEFAULT_INTERNAL_PORT,
  password: '',
  commands: [],
  connectionTimeout: 3,
  responsivenessTimeout: 10,
}

class RedisRunner extends BaseRunner {
  public runnerConfig: RedisRunnerConfig
  public runnerMethods: runnerMethods

  constructor(config: RedisRunnerConfigUserInput) {
    super()

    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.runnerMethods = {
      getComposeService: this.getComposeService,
      checkResponsiveness: this.checkResponsiveness,
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
        ports: [`${port}:${DEFAULT_INTERNAL_PORT}`],
      },
    }
  }

  public checkResponsiveness = () => {
    const { host: runnerHost, password: runnerPassword, responsivenessTimeout } = this.runnerConfig
    const containerId = this.containerId

    // FIXME: Should `-p` be DEFAULT_INTERNAL_PORT or runnerConfig's port?
    const redisCliPingOpts = ` \
                            -h ${runnerHost} \
                            -p ${DEFAULT_INTERNAL_PORT} \
                            ${!!runnerPassword ? `-a ${runnerPassword}` : ''} \
                            PING \
                          `
    const cmd = ` \
                  docker exec ${containerId} redis-cli ${redisCliPingOpts} \
                `

    return createCheckResponsiveness(cmd, responsivenessTimeout)
  }
}

export default RedisRunner

/**
 * DEPRECATED
 */
// const getComposeRunCommand = (runnerConfig: RedisRunnerConfig) => {
//   const { port, service, password } = runnerConfig

//   const portMapping = ` \
//                   --publish ${port}:${DEFAULT_INTERNAL_PORT} \
//                 `
//   const cmd = ` \
//                 ${defaultDockerComposeRunOpts} \
//                 ${portMapping} \
//                 ${service} \
//                 ${!!password ? `--requirepass ${password}` : ''} \
//               `

//   return trimmer(cmd)
// }
