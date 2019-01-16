import DockestConfig from '../DockestConfig'
import DockestLogger from '../DockestLogger'
import jestRunner from './jest'

export type run = () => Promise<void>

const config = new DockestConfig().getConfig()
const logger = new DockestLogger()

export const run: run = async () => {
  logger.loading('Integration test initiated')

  const { runners } = config

  for (const runner of runners) {
    await runner.setup()
  }

  logger.success('Dependencies up and running, ready for Jest unit tests')

  await jestRunner()
}

interface IHelpers {
  clear: () => boolean
  loadData: () => boolean
}

export interface IRunner {
  setup: () => Promise<void>
  teardown: () => Promise<void>
  getHelpers: () => Promise<IHelpers>
}
