import { defaultDockerComposeRunOpts } from '../../constants'
import BaseRunner, { ExecOpts } from '../BaseRunner'
import { getImage, validateTypes } from '../utils'

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
type PostgresRunnerConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>
export type PostgresRunnerConfig = RequiredConfigProps & DefaultableConfigProps

const INTERNAL_PORT: number = 5432
const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: 'localhost',
  port: INTERNAL_PORT,
  commands: [],
  connectionTimeout: 3,
  responsivenessTimeout: 10,
}

const createComposeFileService = (runnerConfig: PostgresRunnerConfig): object => {
  const { service, port, database, username, password } = runnerConfig

  return {
    [service]: {
      image: getImage(service),
      ports: [`${port}:${INTERNAL_PORT}`],
      environment: {
        POSTGRES_DB: database,
        POSTGRES_USER: username,
        POSTGRES_PASSWORD: password,
      },
    },
  }
}

const createComposeRunCmd = (runnerConfig: PostgresRunnerConfig) => {
  const { port, service, database, username, password } = runnerConfig
  const portMapping = ` \ 
                --publish ${port}:${INTERNAL_PORT} \
                `
  const env = ` \
                -e POSTGRES_DB=${database} \
                -e POSTGRES_USER=${username} \
                -e POSTGRES_PASSWORD=${password} \
              `
  const cmd = ` \
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
                -c 'select 1'" \
              `

  return cmd.replace(/\s+/g, ' ').trim()
}

class PostgresRunner extends BaseRunner {
  constructor(configUserInput: PostgresRunnerConfigUserInput) {
    const commandCreators = {
      createComposeRunCmd,
      createCheckResponsivenessCommand,
      createComposeFileService,
    }
    const runnerConfig = {
      ...DEFAULT_CONFIG,
      ...configUserInput,
    }

    super(runnerConfig, commandCreators)

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
      database: validateTypes.isString,
      password: validateTypes.isString,
      username: validateTypes.isString,
    }
    this.validateConfig(schema, runnerConfig)
  }
}

export default PostgresRunner
