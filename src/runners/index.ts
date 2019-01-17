import Dockest from '../'
import Logger from '../DockestLogger'
import JestRunner from './jest'
import PostgresRunner from './postgres'

const { values } = Object
const logger = new Logger()

const run = async (): Promise<void> => {
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

export { PostgresRunner }
export default run
