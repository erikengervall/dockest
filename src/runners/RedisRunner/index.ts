import { defaultDockerComposeRunOpts } from '../../constants'
import Dockest from '../../index'
import BaseRunner, { ExecOpts } from '../BaseRunner'
import { runCustomCommand, validateTypes } from '../utils'

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
export type RedisRunnerConfig = RequiredConfigProps & DefaultableConfigProps
type RedisRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>

const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: 'localhost',
  port: 6379,
  password: '',
  commands: [],
  connectionTimeout: 3,
  responsivenessTimeout: 10,
}

const createStartCommand = (runnerConfig: RedisRunnerConfig) => {
  const { port, service, password } = runnerConfig

  const portMapping = `--publish ${port}:6379`
  const auth = !!password ? `--requirepass ${password}` : ''
  const cmd = `docker-compose run \
                ${defaultDockerComposeRunOpts} \
                ${portMapping} \
                ${service} \
                ${auth}`

  return cmd.replace(/\s+/g, ' ').trim()
}

const createCheckResponsivenessCommand = (runnerConfig: RedisRunnerConfig, execOpts: ExecOpts) => {
  const { host: runnerHost, password: runnerPassword } = runnerConfig
  const { containerId } = execOpts

  const host = `-h ${runnerHost}`
  const port = `-p 6379`
  const password = runnerPassword ? `-a ${runnerPassword}` : ''
  const command = `PING`
  const redisCliOpts = `${host} \
                        ${port} \
                        ${password} \
                        ${command}`
  const cmd = `docker exec ${containerId} redis-cli ${redisCliOpts}`

  return cmd.replace(/\s+/g, ' ').trim()
}

export default class RedisRunner extends BaseRunner {
  public static getHelpers = () => {
    Dockest.jestEnv = true

    return {
      runHelpCmd: async (cmd: string) => runCustomCommand(RedisRunner.name, cmd),
    }
  }

  constructor(config: RedisRunnerConfigUserInput) {
    const commandCreators = {
      createStartCommand,
      createCheckResponsivenessCommand,
    }
    const runnerConfig = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    super(runnerConfig, commandCreators)

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
    }
    this.validateConfig(schema, runnerConfig)
  }
}
