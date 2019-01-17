import setupExitHandler from './exitHandler'
import logger from './logger'
import run, { PostgresRunner } from './runners'
import { IJestConfig } from './runners/jest'
import { validateInputFields } from './utils'
import { tearAll } from './utils/teardown'

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
    setupExitHandler()

    try {
      await run()
    } catch (error) {
      logger.error('Unexpected error', error)

      await tearAll()

      process.exit(1)
    }
  }
}

export const runners = { PostgresRunner }
export default Dockest
