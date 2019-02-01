import setupExitHandler from './exitHandler'
import { IRunners, KafkaRunner, PostgresRunner, ZookeeperRunner } from './runners'
import { validateInputFields } from './utils/config'
import JestRunner, { IJestConfig } from './utils/jest'
import logger from './utils/logger'

interface IDockest {
  verbose?: boolean
  exitHandler?: (err?: Error) => void
}

export interface IDockestConfig {
  dockest: IDockest
  jest: IJestConfig
  runners: IRunners
}

const DEFAULT_CONFIG_DOCKEST = {
  verbose: false,
  exitHandler: () => undefined,
}

class Dockest {
  public static jestRanWithResult: boolean = false
  public static config: IDockestConfig
  private static instance: Dockest

  constructor(userConfig: IDockestConfig) {
    if (Dockest.instance) {
      return Dockest.instance
    }

    const { jest, runners } = userConfig
    const requiredProps = { jest, runners }

    Dockest.config = {
      ...userConfig,
      dockest: {
        ...DEFAULT_CONFIG_DOCKEST,
        ...userConfig.dockest,
      },
    }

    validateInputFields('dockest', requiredProps)

    Dockest.instance = this
  }

  public run = async (): Promise<void> => {
    logger.loading('Dockest initiated')

    setupExitHandler(Dockest.config)

    await this.setupRunners()
    const result = await this.runJest()
    await this.teardownRunners()

    result.success ? process.exit(0) : process.exit(1)
  }

  private setupRunners = async () => {
    const { runners } = Dockest.config

    for (const runnerKey of Object.keys(runners)) {
      logger.setup(runnerKey)
      await runners[runnerKey].setup(runnerKey)
      logger.setupSuccess(runnerKey)
    }
  }

  private teardownRunners = async () => {
    const { runners } = Dockest.config

    for (const runnerKey of Object.keys(runners)) {
      await runners[runnerKey].teardown(runnerKey)
    }
  }

  private runJest = async () => {
    const { jest } = Dockest.config

    const jestRunner = new JestRunner(jest)
    const result = await jestRunner.run()
    Dockest.jestRanWithResult = true

    return result
  }
}

export const runners = { KafkaRunner, PostgresRunner, ZookeeperRunner }

export default Dockest
