import { LOG_LEVEL } from './constants'
import { ConfigurationError } from './errors'
import { BaseLogger } from './loggers'
import onInstantiation, { ErrorPayload } from './onInstantiation'
import onRun, { JestConfig } from './onRun'
import { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } from './runners'
import { Runner } from './runners/@types'
import { execaWrapper, sleep, validateTypes } from './utils'

interface RequiredConfig {
  jest: JestConfig
  runners: Runner[]
}
interface DefaultableUserConfig {
  afterSetupSleep: number
  dev: { idling?: boolean }
  dockerComposeFileName: string
  exitHandler: null | ((error: ErrorPayload) => any)
  logLevel: number
  runInBand: boolean
}
interface InternalConfig {
  DOCKER_COMPOSE_GENERATED_PATH: string
  jestRanWithResult: boolean
}
export type DockestConfig = RequiredConfig & { opts: DefaultableUserConfig } & { $: InternalConfig }

const DEFAULT_CONFIG: DefaultableUserConfig = {
  afterSetupSleep: 0,
  dev: { idling: false },
  dockerComposeFileName: 'docker-compose.yml',
  exitHandler: null,
  logLevel: LOG_LEVEL.NORMAL,
  runInBand: true,
}
const INTERNAL_CONFIG = {
  DOCKER_COMPOSE_GENERATED_PATH: `${__dirname}/docker-compose-generated.yml`,
  jestRanWithResult: false,
}

class Dockest {
  public static config: DockestConfig
  public static logLevel: number
  private static instance: Dockest

  constructor(jest: JestConfig, runners: Runner[], opts: Partial<DefaultableUserConfig> = {}) {
    // @ts-ignore
    Dockest.config = {}
    Dockest.config.$ = INTERNAL_CONFIG
    Dockest.config.jest = jest
    Dockest.config.opts = { ...DEFAULT_CONFIG, ...opts, ...INTERNAL_CONFIG }
    Dockest.config.runners = runners
    BaseLogger.logLevel = Dockest.config.opts.logLevel

    this.validateConfig()
    onInstantiation(Dockest.config)

    return Dockest.instance || (Dockest.instance = this)
  }

  public run = async (): Promise<void> => {
    await onRun(Dockest.config)
  }

  private validateConfig = () => {
    const schema: { [key in keyof RequiredConfig]: any } = {
      jest: validateTypes.isObject,
      runners: validateTypes.isArray,
    }
    const failures = validateTypes(schema, Dockest.config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }

    if (Dockest.config.runners.length <= 0) {
      throw new ConfigurationError('Missing runners')
    }
  }
}

const logLevel = LOG_LEVEL
const runners = { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner }
export { sleep, runners, execaWrapper as execa, logLevel }
export default Dockest
