import { DockestConfig } from '../@types'
import { Logger } from '../Logger'

export const runJest = async ({
  jestLib,
  jestOpts,
  jestOpts: { projects },
  mutables,
}: {
  jestLib: DockestConfig['jestLib']
  jestOpts: DockestConfig['jestOpts']
  mutables: DockestConfig['mutables']
}) => {
  Logger.info('DockestServices running, running Jest', { endingNewLines: 1 })

  const { results } = await jestLib.runCLI(jestOpts, projects)
  const { success, numFailedTests, numTotalTests } = results

  success
    ? Logger.info(`[Jest] All tests passed`, { startingNewLines: 1, endingNewLines: 1, success: true })
    : Logger.error(`[Jest] ${numFailedTests}/${numTotalTests} tests failed`, { endingNewLines: 1 })

  mutables.jestRanWithResult = true

  return {
    success,
  }
}
