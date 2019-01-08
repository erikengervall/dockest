// const jest = require('jest') // tslint:disable-line
import exit from 'exit'

import { IResources } from '../index'

interface IJestResult {
  results: {
    success: true,
  };
}

const jestRunner = async (resources: IResources): Promise<void> => {
  const { Config, Logger, Execs } = resources
  const {
    teardown: { tearAll },
  } = Execs
  const jestOptions = Config.getConfig().jest
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
