import exit from 'exit'
import DockestConfig from '../DockestConfig'
import DockestLogger from '../DockestLogger'
import { tearAll } from '../execs/teardown'

interface IJestResult {
  results: { success: true }
}

const jestRunner = async (): Promise<void> => {
  const config = new DockestConfig().getConfig()
  const Logger = new DockestLogger()
  const jestOptions = config.jest
  const jest = jestOptions.lib

  try {
    const jestResult: IJestResult = await jest.runCLI(jestOptions, jestOptions.projects)

    if (!jestResult.results.success) {
      Logger.failed('Integration test failed')
      await tearAll()

      exit(1)
    } else {
      Logger.success('Integration tests passed successfully')
      await tearAll()

      exit(0)
    }
  } catch (error) {
    Logger.error('Encountered Jest error', error)

    exit(1)
  }
}

export default jestRunner
