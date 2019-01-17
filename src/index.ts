import DockestConfig, { IConfig } from './DockestConfig'
import DockestLogger from './DockestLogger'
import Teardown from './execs/utils/teardown'
import setupExitHandler from './exitHandler'
import run from './runners'
import PostgresRunner from './runners/postgres'

const dockest = async (userConfig?: IConfig): Promise<void> => {
  new DockestConfig(userConfig) // tslint:disable-line
  const logger = new DockestLogger()
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

export const runners = {
  PostgresRunner,
}
export default dockest
