import setupExitHandler from './exitHandler'
import { IRunners, PostgresRunner } from './runners'
import { validateInputFields } from './utils/config'
import JestRunner, { IJestConfig } from './utils/jest'
import logger from './utils/logger'

interface IDockest {
  verbose?: boolean
  exitHandler?: (err?: Error) => void
  dockerComposeFilePath?: string
}

interface IDockestConfig {
  dockest: IDockest
  jest: IJestConfig
  runners: IRunners
}

const { keys } = Object

class Dockest {
  public static config: IDockestConfig
  public static jestRanWithResult: boolean

  constructor(userConfig: IDockestConfig) {
    const { dockest, jest } = userConfig
    const requiredProps = { dockest, jest, runners }
    validateInputFields('Dockest', requiredProps)

    Dockest.config = userConfig
    Dockest.jestRanWithResult = false
  }

  public run = async (): Promise<void> => {
    setupExitHandler()

    logger.loading('Integration test initiated')

    await this.setupRunners()

    const jestRunner = new JestRunner(Dockest.config.jest)
    const result = await jestRunner.run()
    Dockest.jestRanWithResult = true

    await this.teardownRunners()

    result.success ? process.exit(0) : process.exit(1)
  }

  private setupRunners = async () => {
    const { runners } = Dockest.config

    for (const runnerKey of keys(runners)) {
      await runners[runnerKey].setup()
    }
  }

  private teardownRunners = async () => {
    const { runners } = Dockest.config

    for (const runnerKey of keys(runners)) {
      await runners[runnerKey].teardown(runnerKey)
    }
  }
}

export const runners = { PostgresRunner }
export default Dockest
