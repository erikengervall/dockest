import { ConfigurationError } from '../errors'
import { DockestConfig } from '../index'
import { globalLogger } from '../loggers'

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
  runInBand?: boolean
  silent?: boolean
  verbose?: boolean
  forceExit?: boolean
  watchAll?: boolean
}

const DEFAULT_CONFIG = {
  runInBand: true,
  projects: ['.'],
}

const runJest = async (config: DockestConfig) => {
  const jestConfig = { ...DEFAULT_CONFIG, ...config.jest }
  const { lib, projects } = jestConfig
  let success = false

  validateJestConfig(jestConfig)

  try {
    globalLogger.jestSuccess(`Dependencies up and running, running Jest`)
    const jestResult: { results: { success: true } } = await lib.runCLI(jestConfig, projects)

    if (!jestResult.results.success) {
      globalLogger.jestFailed(`Jest test(s) failed`)

      success = false
    } else {
      globalLogger.jestSuccess(`Jest test(s) successful`)

      success = true
    }
  } catch (error) {
    globalLogger.jestError(`Failed to run Jest`, error)

    success = false
  }

  return success
}

const validateJestConfig = (config: JestConfig) => {
  // Validate jest
  if (!config) {
    throw new ConfigurationError('Missing jest configuration object')
  }

  // Validate jest.lib
  if (!config.lib) {
    throw new ConfigurationError('Missing jest.lib')
  }

  // Validate jest version
  const MINIMUM_JEST_VERSION = '20.0.0' // Released 2017-05-06: https://github.com/facebook/jest/releases/tag/v20.0.0
  if (config.lib.getVersion() < MINIMUM_JEST_VERSION) {
    throw new ConfigurationError('Jest version too low, please update')
  }
}

export default runJest
