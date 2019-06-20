import { LOG_LEVEL } from './constants'
import { ConfigurationError } from './errors'
import { BaseLogger } from './loggers'
import onInstantiation, { ErrorPayload } from './onInstantiation'
import onRun, { JestConfig } from './onRun'
import { KafkaRunner, PostgresRunner, RedisRunner, Runner, ZooKeeperRunner } from './runners'
import { execaWrapper, validateTypes } from './utils'

interface RequiredConfigProps {
  jest: JestConfig
  runners: Runner[]
}
interface DefaultableConfigProps {
  afterSetupSleep: number
  exitHandler: null | ((error: ErrorPayload) => any)
  logLevel: number
  dockerComposeFileName: string
  runInBand: boolean
  dev: {
    idling?: boolean
  }
}
interface InternalsConfigProps {
  DOCKER_COMPOSE_GENERATED_PATH: string
  jestRanWithResult: boolean
}
type DockestConfigUserInput = RequiredConfigProps & Partial<DefaultableConfigProps>
export type DockestConfig = RequiredConfigProps & DefaultableConfigProps & InternalsConfigProps

const DEFAULT_CONFIG: DefaultableConfigProps = {
  afterSetupSleep: 0,
  exitHandler: null,
  logLevel: LOG_LEVEL.NORMAL,
  dockerComposeFileName: 'docker-compose.yml',
  runInBand: true,
  dev: {
    idling: false,
  },
}
const INTERNAL_CONFIG = {
  DOCKER_COMPOSE_GENERATED_PATH: `${__dirname}/docker-compose-generated.yml`,
  jestRanWithResult: false,
}

class Dockest {
  public static jestRanWithResult: boolean = false
  public static config: DockestConfig
  public static logLevel: number
  private static instance: Dockest

  constructor(userConfig: DockestConfigUserInput) {
    Dockest.config = { ...DEFAULT_CONFIG, ...userConfig, ...INTERNAL_CONFIG }
    BaseLogger.logLevel = Dockest.config.logLevel

    this.validateConfig()
    onInstantiation(Dockest.config)

    return Dockest.instance || (Dockest.instance = this)
  }

  public run = async (): Promise<void> => {
    await onRun(Dockest.config)
  }

  private validateConfig = () => {
    const schema: { [key in keyof RequiredConfigProps]: any } = {
      jest: validateTypes.isObject,
      runners: validateTypes.isArray,
    }
    const failures = validateTypes(schema, Dockest.config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }
  }
}

const logLevel = LOG_LEVEL
const runners = { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner }
export { logLevel, execaWrapper as execa, runners }
export default Dockest
