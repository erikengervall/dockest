import Logger from './DockestLogger'
import Teardown from './execs/utils/teardown'
import setupExitHandler from './exitHandler'
import run, { PostgresRunner } from './runners'
import { IJestConfig } from './runners/jest'
import { validateInputFields } from './utils'

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

class Dockest {
  public static config: IDockestConfig

  constructor(userConfig: IDockestConfig) {
    const { dockest, jest } = userConfig
    const requiredProps = { dockest, jest, runners }
    validateInputFields('Dockest', requiredProps)

    Dockest.config = userConfig
  }

  public run = async () => {
    const logger = new Logger()
    const teardown = new Teardown()

    setupExitHandler()

    try {
      await run()
    } catch (error) {
      logger.error('Unexpected error', error)

      await teardown.tearAll()

      process.exit(1)
    }
  }
}

export const runners = { PostgresRunner }
export default Dockest
