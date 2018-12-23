import exit from 'exit'
import DockestConfig, { IConfig } from './DockestConfig'
import DockestLogger from './DockestLogger'
import DockestExecs from './execs'
import setupExitHandler from './exitHandler'
import Runners from './runners'

export interface IResources {
  Config: DockestConfig;
  Logger: DockestLogger;
  Execs: DockestExecs;
}

const dockest = async (userConfig?: IConfig): Promise<void> => {
  const Config = new DockestConfig(userConfig)
  const Logger = new DockestLogger(Config)
  const Execs = new DockestExecs(Config, Logger)
  const resources: IResources = { Config, Logger, Execs }

  try {
    setupExitHandler(resources)
    const runners = Runners(resources)

    await runners.all()
  } catch (error) {
    Logger.error('Unexpected error', error)

    await Execs.teardown.tearAll()

    exit(1)
  }
}

export default dockest
