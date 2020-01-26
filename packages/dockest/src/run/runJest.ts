import { DockestConfig, Glob } from '../@types'
import { Logger } from '../Logger'

export const runJest = async ({
  glob,
  jestLib,
  jestOpts,
  jestOpts: { projects },
}: {
  glob: Glob
  jestLib: DockestConfig['jestLib']
  jestOpts: DockestConfig['jestOpts']
}) => {
  Logger.info('DockestServices running, running Jest', { endingNewLines: 1 })

  const { results } = await jestLib.runCLI(jestOpts, projects)
  const { success, numFailedTests, numTotalTests } = results

  success
    ? Logger.info(`[Jest] All tests passed`, { startingNewLines: 1, endingNewLines: 1, success: true })
    : Logger.error(`[Jest] ${numFailedTests}/${numTotalTests} tests failed`, { endingNewLines: 1 })

  glob.jestRanWithResult = true

  return {
    success,
  }
}
