import jest from 'jest'
import { ConfigurationError } from '../errors'
import { DockestConfig } from '../index'
import globalLogger from '../loggers/globalLogger'

interface JestLib {
  getVersion: any
  run: any
  runCLI: any
  SearchSource: any
  TestScheduler: any
  TestWatcher: any
}

export type JestConfig = {
  forceExit?: boolean
  lib?: JestLib
  projects?: string[]
  runInBand?: boolean
  silent?: boolean
  verbose?: boolean
  watchAll?: boolean
}

const DEFAULT_CONFIG = {
  lib: jest,
  projects: ['.'],
  runInBand: true,
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

  config.$.jestRanWithResult = true

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
