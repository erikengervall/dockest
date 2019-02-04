import { ConfigurationError } from '../errors'
import logger from './logger'

interface IJestResult {
  results: { success: true }
}

interface IJestLib {
  SearchSource: any
  TestScheduler: any
  TestWatcher: any
  getVersion: any
  run: any
  runCLI: any
}

export interface IJestConfig {
  lib: IJestLib
  projects?: string[]
  silent?: boolean
  verbose?: boolean
  forceExit?: boolean
  watchAll?: boolean
}

const DEFAULT_CONFIG = {
  projects: ['.'],
}

class JestRunner {
  public static config: IJestConfig
  private static instance: JestRunner

  constructor(config: IJestConfig) {
    if (JestRunner.instance) {
      return JestRunner.instance
    }

    this.validateJestConfig(config)

    JestRunner.config = { ...DEFAULT_CONFIG, ...config }
    JestRunner.instance = this
  }

  public run = async () => {
    const jestOptions = JestRunner.config
    const jest = JestRunner.config.lib
    let success = false

    logger.success(`Dependencies up and running, running Jest`)

    try {
      const jestResult: IJestResult = await jest.runCLI(jestOptions, jestOptions.projects)

      if (!jestResult.results.success) {
        logger.jestFailed(`Jest test(s) failed`)

        success = false
      } else {
        logger.jestSuccess(`Jest run successfully`)

        success = true
      }
    } catch (error) {
      logger.error(`Encountered Jest error`, error)

      success = false
    }

    return {
      success,
    }
  }

  private validateJestConfig = (config: IJestConfig) => {
    if (!config) {
      throw new ConfigurationError('Jest config missing')
    }

    const MINIMUM_JEST_VERSION = '20.0.0' // Released 2017-05-06: https://github.com/facebook/jest/releases/tag/v20.0.0
    if (config.lib.getVersion() < MINIMUM_JEST_VERSION) {
      throw new ConfigurationError('Jest version not supported')
    }
  }
}

export default JestRunner
