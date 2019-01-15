import { IResources } from '../'
import jestRunner from './jest'
import postgresRunner from './postgres'

export type all = () => Promise<void>

export interface IRunner {
  all: all;
}

const Runner = (resources: IResources): IRunner => {
  const { Config, Logger } = resources

  const all: all = async () => {
    Logger.loading('Integration test initiated')

    const config = Config.getConfig()
    const { postgres: postgresConfigs } = config

    for (const postgresConfig of postgresConfigs) {
      await postgresRunner(postgresConfig, resources)
    }

    Logger.success('Dependencies up and running, ready for Jest unit tests')

    await jestRunner(resources)
  }

  return {
    all,
  }
}

export default Runner
