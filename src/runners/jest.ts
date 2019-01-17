import DockestConfig from '../DockestConfig'
import DockestLogger from '../DockestLogger'

interface IJestResult {
  results: { success: true }
}

const jestRunner = async (): Promise<{ success: boolean }> => {
  const config = new DockestConfig().getConfig()
  const Logger = new DockestLogger()
  const jestOptions = config.jest
  const jest = jestOptions.lib
  let success = false

  try {
    const jestResult: IJestResult = await jest.runCLI(jestOptions, jestOptions.projects)

    if (!jestResult.results.success) {
      Logger.failed(`${jestRunner.name}: Integration test failed`)

      success = false
    } else {
      Logger.success(`${jestRunner.name}: Integration tests passed successfully`)

      success = true
    }
  } catch (error) {
    Logger.error(`${jestRunner.name}: Encountered Jest error`, error)

    success = false
  }

  return {
    success,
  }
}

export default jestRunner
