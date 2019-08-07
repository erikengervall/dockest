import { DEFAULT_USER_CONFIG, LOG_LEVEL } from './constants'
import { ErrorPayload } from './@types'
import { JestConfig } from './onRun/runJest'
import { KafkaRunner, PostgresRunner, RedisRunner, ZooKeeperRunner } from './runners'
import { Runner } from './runners/@types'
import BaseError from './errors/BaseError'
import ConfigurationError from './errors/ConfigurationError'
import execaWrapper from './utils/execaWrapper'
import onInstantiation from './onInstantiation'
import onRun from './onRun'
import sleep from './utils/sleep'
import validateTypes from './utils/validateTypes'

interface RequiredConfig {
  runners: Runner[]
}
interface DefaultableUserConfig {
  afterSetupSleep: number
  composeFileName: string
  dev: { debug?: boolean }
  dumpErrors: boolean
  exitHandler: null | ((error: ErrorPayload) => any)
  logLevel: number
  runInBand: boolean
}
interface InternalConfig {
  dockerComposeGeneratedPath: string
  failedTeardowns: { service: string; containerId: string }[]
  jestRanWithResult: boolean
  perfStart: number
}
export interface DockestConfig {
  runners: Runner[]
  opts: DefaultableUserConfig
  jest: JestConfig
  $: InternalConfig
}

const INTERNAL_CONFIG = {
  dockerComposeGeneratedPath: `${__dirname}/docker-compose-generated.yml`,
  failedTeardowns: [],
  jestRanWithResult: false,
  perfStart: Date.now(),
}

class Dockest {
  private config: DockestConfig

  public constructor({
    runners,
    jest = {},
    opts = {},
  }: {
    runners: Runner[]
    jest?: JestConfig
    opts?: Partial<DefaultableUserConfig>
  }) {
    this.config = {
      jest,
      runners,
      opts: { ...DEFAULT_USER_CONFIG, ...opts },
      $: { ...INTERNAL_CONFIG },
    }
    BaseError.DockestConfig = this.config

    this.validateConfig()
    onInstantiation(this.config)
  }

  public run = async (): Promise<void> => {
    this.config.$.perfStart = Date.now()

    await onRun(this.config)
  }

  private validateConfig = async () => {
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
          `Service property has to be unique. Collision found for runner with service "${runner.runnerConfig.service}"`,
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
