import { ErrorPayload } from './@types'
import { LOG_LEVEL } from './constants'
import { ConfigurationError } from './errors'
import { BaseLogger } from './loggers'
import onInstantiation from './onInstantiation'
import onRun from './onRun'
import { JestConfig } from './onRun/runJest'
import { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } from './runners'
import { Runner } from './runners/@types'
import { execaWrapper, sleep, validateTypes } from './utils'

interface RequiredConfig {
  runners: Runner[]
}
interface DefaultableUserConfig {
  afterSetupSleep: number
  dev: {
    debug?: boolean
  }
  composeFileName: string
  exitHandler: null | ((error: ErrorPayload) => any)
  logLevel: number
  runInBand: boolean
}
interface InternalConfig {
  dockerComposeGeneratedPath: string
  jestRanWithResult: boolean
  perfStart: number
}
export type DockestConfig = {
  runners: Runner[]
  opts: DefaultableUserConfig
  jest: JestConfig
  $: InternalConfig
}

const DEFAULT_CONFIG: DefaultableUserConfig = {
  afterSetupSleep: 0,
  dev: {
    debug: false,
  },
  composeFileName: 'docker-compose.yml',
  exitHandler: null,
  logLevel: LOG_LEVEL.NORMAL,
  runInBand: true,
}
const INTERNAL_CONFIG = {
  dockerComposeGeneratedPath: `${__dirname}/docker-compose-generated.yml`,
  jestRanWithResult: false,
  perfStart: Date.now(),
}

class Dockest {
  private config: DockestConfig

  constructor({
    runners,
    jest,
    opts = {},
  }: {
    runners: Runner[]
    jest: JestConfig
    opts: Partial<DefaultableUserConfig>
  }) {
    this.config = {
      jest,
      runners,
      opts: { ...DEFAULT_CONFIG, ...opts },
      $: { ...INTERNAL_CONFIG },
    }
    BaseLogger.logLevel = this.config.opts.logLevel

    this.validateConfig()
    onInstantiation(this.config)
  }

  public run = async (): Promise<void> => {
    this.config.$.perfStart = Date.now()

    await onRun(this.config)
  }

  private validateConfig = () => {
    const schema: { [key in keyof RequiredConfig]: any } = {
      runners: validateTypes.isArray,
    }
    const failures = validateTypes(schema, this.config)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }

    if (this.config.runners.length <= 0) {
      throw new ConfigurationError('Missing runners')
    }

    // Validate service name uniqueness
    const map: { [key: string]: string } = {}
    for (const runner of this.config.runners) {
      if (map[runner.runnerConfig.service]) {
        throw new ConfigurationError(
          `Service property has to be unique. Collision found for runner with service "${runner.runnerConfig.service}"`
        )
      }
      map[runner.runnerConfig.service] = runner.runnerConfig.service
    }
  }
}

const logLevel = LOG_LEVEL
const runners = { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner }
export { sleep, runners, execaWrapper as execa, logLevel }
export default Dockest
