import { LOG_LEVEL } from './constants'
import { ConfigurationError } from './errors'
import setupExitHandler from './exitHandler'
import JestRunner, { IJestConfig } from './jest'
import { RunnerLogger } from './loggers'
import { IRunners, KafkaRunner, PostgresRunner, RedisRunner, ZookeeperRunner } from './runners'
import { runCustomCommand, validateTypes } from './runners/utils'

interface IDockest {
  logLevel: number
  exitHandler?: (err?: Error) => void
}

export interface IDockestConfig {
  dockest: IDockest
  jest: IJestConfig
  runners: IRunners
}

const DEFAULT_CONFIG = {
  logLevel: LOG_LEVEL.NORMAL,
  exitHandler: () => undefined,
}

class Dockest {
  public static jestRanWithResult: boolean = false
  public static config: IDockestConfig
  /**
   * jestEnv
   * Dockest has been imported from a non-global node env (e.g. jest's node vm)
   * This means that the Dockest singleton is unretrievable
   * This variable is primarily used to default the logLevel to normal
   */
  public static jestEnv: boolean = false
  private static jestRunner: JestRunner
  private static instance: Dockest

  constructor(userConfig: IDockestConfig) {
    Dockest.config = {
      ...userConfig,
      dockest: {
        ...DEFAULT_CONFIG,
        ...userConfig.dockest,
      },
    }

    Dockest.jestRunner = new JestRunner(Dockest.config.jest)

    this.validateConfig()
    setupExitHandler(Dockest.config)

    return Dockest.instance || (Dockest.instance = this)
  }

  public run = async (): Promise<void> => {
    await this.setupRunners()
    const result = await this.runJest()
    await this.teardownRunners()

    result.success ? process.exit(0) : process.exit(1)
  }

  private setupRunners = async () => {
    const { runners } = Dockest.config

    await runCustomCommand('Dockest', 'docker-compose pull')

    for (const runnerKey of Object.keys(runners)) {
      RunnerLogger.setup(runnerKey)
      await runners[runnerKey].setup(runnerKey)
      RunnerLogger.setupSuccess(runnerKey)
    }
  }

  private runJest = async () => {
    const result = await Dockest.jestRunner.run()
    Dockest.jestRanWithResult = true

    return result
  }

  private teardownRunners = async () => {
    const { runners } = Dockest.config

    for (const runnerKey of Object.keys(runners)) {
      await runners[runnerKey].teardown()
    }
  }

  private validateConfig = () => {
    const schema = {
      logLevel: validateTypes.isOneOf(Object.values(LOG_LEVEL)),
    }

    const failures = validateTypes(schema, Dockest.config.dockest)

    if (failures.length > 0) {
      throw new ConfigurationError(`${failures.join('\n')}`)
    }
  }
}

export const runners = { KafkaRunner, PostgresRunner, RedisRunner, ZookeeperRunner }
export const logLevel = LOG_LEVEL

export default Dockest
