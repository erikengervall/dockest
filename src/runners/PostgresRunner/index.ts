import { defaultDockerComposeRunOpts } from '../../constants'
import BaseRunner, { ExecOpts } from '../BaseRunner'
import { getImage, trimmer, validateConfig, validateTypes } from '../utils'

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

const DEFAULT_INTERNAL_PORT: number = 5432
const DEFAULT_CONFIG: DefaultableConfigProps = {
  host: 'localhost',
  port: DEFAULT_INTERNAL_PORT,
  commands: [],
  connectionTimeout: 3,
  responsivenessTimeout: 10,
}

const getComposeService = (
  runnerConfig: PostgresRunnerConfig,
  dockerComposeFileName: string
): object => {
  const { service, port, database, username, password } = runnerConfig

  return {
    [service]: {
      image: getImage(service, dockerComposeFileName),
      ports: [`${port}:${DEFAULT_INTERNAL_PORT}`],
      environment: {
        POSTGRES_DB: database,
        POSTGRES_USER: username,
        POSTGRES_PASSWORD: password,
      },
    },
  }
}

/**
 * DEPRECATED
 */
// const getComposeRunCommand = (runnerConfig: PostgresRunnerConfig): string => {
//   const { port, service, database, username, password } = runnerConfig
//   const portMapping = ` \
//                 --publish ${port}:${DEFAULT_INTERNAL_PORT} \
//                 `
//   const env = ` \
//                 -e POSTGRES_DB=${database} \
//                 -e POSTGRES_USER=${username} \
//                 -e POSTGRES_PASSWORD=${password} \
//               `
//   const cmd = ` \
//                 ${defaultDockerComposeRunOpts} \
//                 ${portMapping} \
//                 ${env} \
//                 ${service} \
//               `

//   return trimmer(cmd)
// }

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

  return trimmer(cmd)
}

class PostgresRunner extends BaseRunner {
  constructor(configUserInput: PostgresRunnerConfigUserInput) {
    const runnerConfig = {
      ...DEFAULT_CONFIG,
      ...configUserInput,
    }
    const runnerCommandFactories = {
      createCheckResponsivenessCommand,
      getComposeService,
    }

    super(runnerConfig, runnerCommandFactories)

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
      database: validateTypes.isString,
      password: validateTypes.isString,
      username: validateTypes.isString,
    }
    validateConfig(schema, runnerConfig)
  }
}

export default PostgresRunner
