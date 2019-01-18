import setupExitHandler from './exitHandler'
import { PostgresRunner } from './runners'
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
  runners: PostgresRunner[]
}

const { values } = Object

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

    const { runners } = Dockest.config

    // setup runners
    for (const runner of values(runners)) {
      await runner.setup()
    }

    // evaluate jest result
    const jestRunner = new JestRunner(Dockest.config.jest)
    const result = await jestRunner.run()
    Dockest.jestRanWithResult = true

    // teardown runners
    for (const runner of values(runners)) {
      await runner.teardown()
    }

    result.success ? process.exit(0) : process.exit(1)
  }
}

export const runners = { PostgresRunner }
export default Dockest
