import { defaultDockerComposeRunOpts } from '../../constants'
import BaseRunner, { ExecOpts } from '../BaseRunner'
import { getImage, trimmer, validateConfig, validateTypes } from '../utils'

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

const getComposeService = (
  runnerConfig: RedisRunnerConfig,
  dockerComposeFileName: string
): object => {
  const { service, port } = runnerConfig

  return {
    [service]: {
      image: getImage(service, dockerComposeFileName),
      ports: [`${port}:${DEFAULT_INTERNAL_PORT}`],
    },
  }
}

// Deprecated
const getComposeRunCommand = (runnerConfig: RedisRunnerConfig) => {
  const { port, service, password } = runnerConfig

  const portMapping = ` \
                  --publish ${port}:${DEFAULT_INTERNAL_PORT} \
                `
  const cmd = ` \
                ${defaultDockerComposeRunOpts} \
                ${portMapping} \
                ${service} \
                ${!!password ? `--requirepass ${password}` : ''} \
              `

  return trimmer(cmd)
}

const createCheckResponsivenessCommand = (runnerConfig: RedisRunnerConfig, execOpts: ExecOpts) => {
  const { host: runnerHost, password: runnerPassword } = runnerConfig
  const { containerId } = execOpts

  // TODO: Should `-p` be DEFAULT_INTERNAL_PORT or runnerConfig's port?
  const redisCliPingOpts = ` \
                          -h ${runnerHost} \
                          -p ${DEFAULT_INTERNAL_PORT} \
                          ${!!runnerPassword ? `-a ${runnerPassword}` : ''} \
                          PING \
                        `
  const cmd = ` \
                docker exec ${containerId} redis-cli ${redisCliPingOpts} \
              `

  return trimmer(cmd)
}

class RedisRunner extends BaseRunner {
  constructor(config: RedisRunnerConfigUserInput) {
    const runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }
    const runnerCommandFactories = {
      getComposeRunCommand,
      getComposeService,
      createCheckResponsivenessCommand,
    }

    super(runnerConfig, runnerCommandFactories)

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }
    validateConfig(schema, runnerConfig)
  }
}

export default RedisRunner
