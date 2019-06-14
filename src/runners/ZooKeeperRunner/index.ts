import { DEFAULT_CONNECTION_TIMEOUT, DEFAULT_HOST } from '../../constants'
import { getImage, validateConfig, validateTypes } from '../../utils'
import BaseRunner, { runnerMethods } from '../BaseRunner'
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

class ZooKeeperRunner extends BaseRunner {
  public runnerConfig: ZooKeeperRunnerConfig
  public runnerMethods: runnerMethods

  constructor(config: RequiredConfigProps & Partial<DefaultableConfigProps>) {
    super()

    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    this.runnerMethods = {
      getComposeService: this.getComposeService,
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
        environment: {
          ZOOKEEPER_CLIENT_PORT: port,
        },
      },
    }
  }
}

export { ZooKeeperRunnerConfig }
export default ZooKeeperRunner

/**
 * DEPRECATED
 */
// const getComposeRunCommand = (runnerConfig: ZooKeeperRunnerConfig): string => {
//   const { port, service } = runnerConfig

//   const portMapping = `--publish ${port}:${DEFAULT_INTERNAL_PORT}`

//   // https://docs.confluent.io/current/installation/docker/config-reference.html#required-zk-settings
//   const env = ` \
//                 -e ZOOKEEPER_CLIENT_PORT=${port} \
//               `

//   const cmd = ` \
//                 ${defaultDockerComposeRunOpts} \
//                 ${portMapping} \
//                 ${env} \
//                 ${service} \
//               `

//   return trimmer(cmd)
// }
