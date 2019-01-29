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

  constructor(userConfig: IDockestConfig) {
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
  }

  public run = async (): Promise<void> => {
    logger.loading('Integration test initiated')

    const { jest, runners } = Dockest.config
    setupExitHandler(Dockest.config)

    await this.setupRunners(runners)
    const result = await this.runJest(jest)
    await this.teardownRunners(runners)

    result.success ? process.exit(0) : process.exit(1)
  }

  private setupRunners = async (runners: IRunners) => {
    for (const runnerKey of Object.keys(runners)) {
      logger.setup(runnerKey)
      await runners[runnerKey].setup(runnerKey)
      logger.setupSuccess(runnerKey)
    }
  }

  private runJest = async (jest: IJestConfig) => {
    const jestRunner = new JestRunner(jest)
    const result = await jestRunner.run()
    Dockest.jestRanWithResult = true

    return result
  }

  private teardownRunners = async (runners: IRunners) => {
    for (const runnerKey of Object.keys(runners)) {
      await runners[runnerKey].teardown(runnerKey)
    }
  }
}

export const runners = { KafkaRunner, PostgresRunner, ZookeeperRunner }

export default Dockest
