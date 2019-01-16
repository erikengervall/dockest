import DockestConfig from '../DockestConfig'
import DockestLogger from '../DockestLogger'
import jestRunner from './jest'

export type run = () => Promise<void>

export interface IRunner {
  setup: () => Promise<void>
  teardown: () => Promise<void>
  getHelpers: () => Promise<{
    clear: () => boolean
    loadData: () => boolean
  }>
}

const config = new DockestConfig().getConfig()
const logger = new DockestLogger()

const run: run = async () => {
  logger.loading('Integration test initiated')

  const { runners } = config

  for (const runner of runners) {
    await runner.setup()
  }

  logger.success('Dependencies up and running, ready for Jest unit tests')

  await jestRunner()
}

export default run
