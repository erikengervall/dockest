import { DockestConfig } from '../@types'
import { Logger } from '../logger'

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

  // typecasting required due to runCLI's first argument's messy typings: `yargs.Arguments<Partial<{...}>>`
  const { results } = await jestLib.runCLI(jestOpts as any, projects ?? [])

  const { success, numFailedTests, numTotalTests } = results

  success
    ? Logger.info(`[Jest] All tests passed`, { startingNewLines: 1, endingNewLines: 1, success: true })
    : Logger.error(`[Jest] ${numFailedTests}/${numTotalTests} tests failed`, { endingNewLines: 1 })

  mutables.jestRanWithResult = true

  return {
    success,
  }
}
