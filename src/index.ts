import exit from 'exit'
import DockestConfig, { IConfig } from './DockestConfig'
import DockestLogger from './DockestLogger'
import { tearAll } from './execs/teardown'
import setupExitHandler from './exitHandler'
import { run } from './runners'
import PostgresRunner from './runners/postgres'

const dockest = async (userConfig?: IConfig): Promise<void> => {
  new DockestConfig(userConfig) // tslint:disable-line
  const Logger = new DockestLogger()

  try {
    setupExitHandler()

    await run()
  } catch (error) {
    Logger.error('Unexpected error', error)

    await tearAll()

    exit(1)
  }
}

export const runners = {
  PostgresRunner,
}
export default dockest
