import { defaultDockerComposeRunOpts } from '../../constants'
import BaseRunner from '../BaseRunner'
import { getImage, trimmer, validateTypes } from '../utils'

interface RequiredConfigProps {
  service: string
}
interface DefaultableConfigProps {
  connectionTimeout: number
  host: string
  port: number
  commands: [] // FIXME: Figure out how to remove this without upsetting `BaseRunner.ts`
}
type ZooKeeperRunnerConfig = RequiredConfigProps & DefaultableConfigProps
type ZooKeeperRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>

const DEFAULT_INTERNAL_PORT: number = 2181
const DEFAULT_CONFIG: DefaultableConfigProps = {
  connectionTimeout: 30,
  host: 'localhost',
  port: DEFAULT_INTERNAL_PORT,
  commands: [],
}

const getComposeService = (
  runnerConfig: ZooKeeperRunnerConfig,
  dockerComposeFileName: string
): object => {
  const { service, port } = runnerConfig

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

// Deprecated
const getComposeRunCommand = (runnerConfig: ZooKeeperRunnerConfig): string => {
  const { port, service } = runnerConfig

  const portMapping = `--publish ${port}:${DEFAULT_INTERNAL_PORT}`

  // https://docs.confluent.io/current/installation/docker/config-reference.html#required-zk-settings
  const env = ` \
                -e ZOOKEEPER_CLIENT_PORT=${port} \
              `

  const cmd = ` \
                ${defaultDockerComposeRunOpts} \
                ${portMapping} \
                ${env} \
                ${service} \
              `

  return trimmer(cmd)
}

class ZooKeeperRunner extends BaseRunner {
  constructor(config: ZooKeeperRunnerConfigUserInput) {
    const runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    const runnerCommandFactories = {
      getComposeService,
      getComposeRunCommand,
    }

    super(runnerConfig, runnerCommandFactories)

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }
    this.validateConfig(schema, runnerConfig)
  }
}

export { ZooKeeperRunnerConfig }
export default ZooKeeperRunner
