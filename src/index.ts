import setupExitHandler from './exitHandler'
import { PostgresRunner } from './runners'
import JestRunner, { IJestConfig } from './utils/jest'
import logger from './utils/logger'
import { validateInputFields } from './utils/runnerUtils'

interface IDockest {
  verbose?: boolean
  exitHandler?: (err?: Error) => void
  dockerComposeFilePath?: string
}

interface IDockestConfig {
  dockest: IDockest
  jest: IJestConfig
  runners: PostgresRunner[]
}

const { values } = Object

class Dockest {
  public static config: IDockestConfig

  constructor(userConfig: IDockestConfig) {
    const { dockest, jest } = userConfig
    const requiredProps = { dockest, jest, runners }
    validateInputFields('Dockest', requiredProps)

    Dockest.config = userConfig
  }

  public run = async (): Promise<void> => {
    setupExitHandler()

    logger.loading('Integration test initiated')

    const { runners } = Dockest.config

    // setup runners
    for (const runner of values(runners)) {
      await runner.setup()
    }

    // evaluate jest result
    const jestRunner = new JestRunner(Dockest.config.jest)
    const result = await jestRunner.run()

    // teardown runners
    for (const runner of values(runners)) {
      await runner.teardown()
    }

    result.success ? process.exit(0) : process.exit(1)
  }
}

export const runners = { PostgresRunner }
export default Dockest
