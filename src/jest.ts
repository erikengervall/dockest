import { ConfigurationError } from './errors'
import { JestLogger } from './loggers'

interface JestResult {
  results: {
    success: true
  }
}

interface JestLib {
  SearchSource: any
  TestScheduler: any
  TestWatcher: any
  getVersion: any
  run: any
  runCLI: any
}

export type JestConfig = {
  lib: JestLib
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
  public static config: JestConfig
  private static instance: JestRunner

  constructor(config: JestConfig) {
    if (JestRunner.instance) {
      return JestRunner.instance
    }

    JestRunner.config = {
      ...DEFAULT_CONFIG,
      ...config,
    }

    this.validateJestConfig()

    JestRunner.instance = this
  }

  public run = async () => {
    const jestOptions = JestRunner.config
    const jest = JestRunner.config.lib
    let success = false

    JestLogger.success(`Dependencies up and running, running Jest`)

    try {
      const jestResult: JestResult = await jest.runCLI(jestOptions, jestOptions.projects)

      if (!jestResult.results.success) {
        JestLogger.failed(`Jest test(s) failed`)

        success = false
      } else {
        JestLogger.success(`Jest test(s) successful`)

        success = true
      }
    } catch (error) {
      JestLogger.error(`Failed to run Jest`, error)

      success = false
    }

    return {
      success,
    }
  }

  private validateJestConfig = () => {
    const config = JestRunner.config

    // Validate jest
    if (!config) {
      throw new ConfigurationError('jest')
    }

    // Validate jest.lib
    if (!config.lib) {
      throw new ConfigurationError('jest.lib')
    }

    // Validate jest version
    const MINIMUM_JEST_VERSION = '20.0.0' // Released 2017-05-06: https://github.com/facebook/jest/releases/tag/v20.0.0
    if (config.lib.getVersion() < MINIMUM_JEST_VERSION) {
      throw new ConfigurationError('Jest version not supported')
    }
  }
}

export default JestRunner
