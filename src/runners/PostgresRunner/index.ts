import { defaultDockerComposeRunOpts } from '../../constants'
import Dockest from '../../index'
import BaseRunner, { ExecOpts } from '../BaseRunner'
import { runCustomCommand, validateTypes } from '../utils'

interface RequiredConfigProps {
  service: string
  database: string
  username: string
  password: string
}
interface DefaultableConfigProps {
  host: string
  port: number
  commands: string[]
  connectionTimeout: number
  responsivenessTimeout: number
}
interface RunTimeConfigProps {
  runnerKey: string
}
export type PostgresRunnerConfig = RequiredConfigProps &
  DefaultableConfigProps &
  Partial<RunTimeConfigProps>
type PostgresRunnerConfigUserInput = RequiredConfigProps &
  Partial<DefaultableConfigProps> &
  Partial<RunTimeConfigProps>

const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: 'localhost',
  port: 5432,
  commands: [],
  connectionTimeout: 3,
  responsivenessTimeout: 10,
}

const createStartCommand = (runnerConfig: PostgresRunnerConfig) => {
  const { port, service, database, username, password } = runnerConfig
  const portMapping = ` \ 
                --publish ${port}:5432 \
                `
  const env = ` \
                -e POSTGRES_DB=${database} \
                -e POSTGRES_USER=${username} \
                -e POSTGRES_PASSWORD=${password} \
              `
  const cmd = ` \
                docker-compose run \
                ${defaultDockerComposeRunOpts} \
                ${portMapping} \
                ${env} \
                ${service} \
              `

  return cmd.replace(/\s+/g, ' ').trim()
}

const createCheckResponsivenessCommand = (
  runnerConfig: PostgresRunnerConfig,
  execOpts: ExecOpts
) => {
  const { host, database, username } = runnerConfig
  const { containerId } = execOpts
  const cmd = ` \
                docker exec ${containerId} \
                bash -c "psql \
                -h ${host} \
                -d ${database} \
                -U ${username} \
                -c 'select 1'"
              `

  return cmd.replace(/\s+/g, ' ').trim()
}

export class PostgresRunner extends BaseRunner {
  public static getHelpers = () => {
    Dockest.jestEnv = true

    return {
      runHelpCmd: async (cmd: string) => runCustomCommand(PostgresRunner.name, cmd),
    }
  }

  constructor(configUserInput: PostgresRunnerConfigUserInput) {
    const commandCreators = {
      start: createStartCommand,
      checkResponsiveness: createCheckResponsivenessCommand,
    }
    const runnerConfig = {
      ...DEFAULT_CONFIG,
      ...configUserInput,
    }
    // @ts-ignore // TODO: This needs to be addressed
    super(runnerConfig, commandCreators)

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
      database: validateTypes.isString,
      password: validateTypes.isString,
      username: validateTypes.isString,
    }
    this.validateConfig(schema, this.runnerConfig)
  }
}

export default PostgresRunner
