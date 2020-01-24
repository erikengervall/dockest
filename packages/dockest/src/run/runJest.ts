import { DEFAULT_OPTS } from '../constants'
import { DockestConfig } from '../@types'
import { Logger } from '../Logger'

export const runJest = async (config: DockestConfig) => {
  const {
    opts: { jestLib, jestOpts },
  } = config

  Logger.info('DockestServices running, running Jest', { endingNewLines: 1 })

  const { results } = await jestLib.runCLI(jestOpts, jestOpts?.projects || DEFAULT_OPTS.jestOpts.projects)
  const { success, numFailedTests, numTotalTests } = results

  success
    ? Logger.info(`[Jest] All tests passed`, { startingNewLines: 1, endingNewLines: 1, success: true })
    : Logger.error(`[Jest] ${numFailedTests}/${numTotalTests} tests failed`, { endingNewLines: 1 })

  config.$.jestRanWithResult = true

  return {
    success,
  }
}
