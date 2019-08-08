import jest from 'jest'

import { DockestConfig } from '../index'
import ConfigurationError from '../errors/ConfigurationError'
import Logger from '../Logger'

interface JestLib {
  getVersion: any
  runCLI: any
}

export interface JestConfig {
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
    Logger.info(`Dependencies up and running: Executing Jest`, { nl: 1 })
    const jestResult: { results: { success: boolean } } = await lib.runCLI(jestConfig, projects)

    if (!jestResult.results.success) {
      Logger.error(`Jest test(s) failed`, { nl: 1 })

      success = false
    } else {
      Logger.info(`Jest test(s) successful`, { pnl: 1, nl: 1 })

      success = true
    }
  } catch (error) {
    Logger.error(`Jest test(s) failed`, { data: { error } })

    success = false
  }

  config.$.jestRanWithResult = true

  return success
}

const validateJestConfig = (config: JestConfig) => {
  // Validate jest
  if (!config) {
    throw new ConfigurationError('Jest configuration object missing')
  }

  // Validate jest.lib
  if (!config.lib) {
    throw new ConfigurationError('Jest libray missing')
  }

  // Validate jest version
  const MINIMUM_JEST_VERSION = '20.0.0' // Released 2017-05-06: https://github.com/facebook/jest/releases/tag/v20.0.0
  if (config.lib.getVersion() < MINIMUM_JEST_VERSION) {
    throw new ConfigurationError('Jest version too old: Please update')
  }
}

export default runJest
