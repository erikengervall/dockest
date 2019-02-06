import { LOG_LEVEL } from './constants'
import { ConfigurationError } from './errors'
import setupExitHandler from './exitHandler'
import JestRunner, { IJestConfig } from './jest'
import { RunnerLogger } from './loggers'
import { IRunners, KafkaRunner, PostgresRunner, ZookeeperRunner } from './runners'

interface IDockest {
  logLevel: number
  exitHandler?: (err?: Error) => void
}

export interface IDockestConfig {
  dockest: IDockest
  jest: IJestConfig
  runners: IRunners
}

const DEFAULT_CONFIG_DOCKEST = {
  logLevel: LOG_LEVEL.NORMAL,
  exitHandler: () => undefined,
}

class Dockest {
  public static jestRanWithResult: boolean = false
  public static config: IDockestConfig
  private static jestRunner: JestRunner
  private static instance: Dockest

  constructor(userConfig: IDockestConfig) {
    Dockest.config = {
      ...userConfig,
      dockest: {
        ...DEFAULT_CONFIG_DOCKEST,
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
      await runners[runnerKey].teardown(runnerKey)
    }
  }

  private validateConfig = () => {
    const { dockest } = Dockest.config

    // Validate dockest
    if (!Object.values(LOG_LEVEL).includes(dockest.logLevel)) {
      throw new ConfigurationError('logLevel')
    }
  }
}

export const runners = { KafkaRunner, PostgresRunner, ZookeeperRunner }
export const logLevel = LOG_LEVEL

export default Dockest
