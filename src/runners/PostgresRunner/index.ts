import { getImage, validateConfig, validateTypes } from '../../utils'
import BaseRunner, { runnerMethods } from '../BaseRunner'

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

class PostgresRunner extends BaseRunner {
  public runnerConfig: PostgresRunnerConfig
  public runnerMethods: runnerMethods

  constructor(configUserInput: PostgresRunnerConfigUserInput) {
    super()

    this.runnerConfig = {
      ...DEFAULT_CONFIG,
      ...configUserInput,
    }
    this.runnerMethods = {
      getComposeService: this.getComposeService,
      createResponsivenessCheckCmd: this.createResponsivenessCheckCmd,
    }

    const schema: { [key in keyof RequiredConfigProps]: any } = {
      service: validateTypes.isString,
      database: validateTypes.isString,
      password: validateTypes.isString,
      username: validateTypes.isString,
    }
    validateConfig(schema, this.runnerConfig)
  }

  public getComposeService = (dockerComposeFileName: string) => {
    const { service, port, database, username, password } = this.runnerConfig

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

  public createResponsivenessCheckCmd = () => {
    const { host, database, username } = this.runnerConfig
    const containerId = this.containerId
    const cmd = ` \
                  docker exec ${containerId} \
                  bash -c "psql \
                  -h ${host} \
                  -d ${database} \
                  -U ${username} \
                  -c 'select 1'" \
                `

    return cmd
  }
}

export default PostgresRunner

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
