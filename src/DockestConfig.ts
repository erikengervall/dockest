import merge from 'deepmerge'
import fs from 'fs'

import ConfigurationError from './errors/ConfigurationError'
import IPostgresRunner from './runners/postgres'

export interface IJestConfig {
  lib: {
    SearchSource: any
    TestScheduler: any
    TestWatcher: any
    getVersion: any
    run: any
    runCLI: any
  }
  silent?: boolean
  verbose?: boolean
  forceExit?: boolean
  watchAll?: boolean
  projects: string[]
}

export interface IConfig {
  jest: IJestConfig
  dockest: {
    verbose?: boolean
    exitHandler?: (err?: Error) => void
    dockerComposeFilePath?: string
  }
  runners: IPostgresRunner[]
}

const DEFAULT_CONFIG = {
  jest: {
    projects: ['.'],
  },
  dockest: {
    verbose: false,
  },
  runners: [],
}

export class DockestConfig {
  private static instance: DockestConfig
  private static config: IConfig

  constructor(userConfig?: IConfig) {
    if (DockestConfig.instance) {
      return DockestConfig.instance
    }

    const dockestRcFilePath = `${process.cwd()}/.dockestrc.js`

    if (userConfig && typeof userConfig === 'object') {
      DockestConfig.config = userConfig
    } else if (fs.existsSync(dockestRcFilePath)) {
      DockestConfig.config = require(dockestRcFilePath)
    } else {
      throw new ConfigurationError('Could not find ".dockestrc.js"')
    }

    if (DockestConfig.config && typeof DockestConfig.config === 'object') {
      DockestConfig.config = merge(DEFAULT_CONFIG, DockestConfig.config)
    } else {
      throw new ConfigurationError('Configuration step failed')
    }

    this.validateUserConfig(DockestConfig.config)
    DockestConfig.instance = this
  }

  validateRequiredFields = (origin: string, requiredFields: any): void => {
    const missingFields = Object.keys(requiredFields).reduce(
      (acc: boolean[], requiredField: any) =>
        !!requiredFields[requiredField] ? acc : acc.concat(requiredField),
      []
    )

    if (missingFields.length !== 0) {
      throw new ConfigurationError(
        `Invalid ${origin} configuration, missing required fields: [${missingFields.join(', ')}]`
      )
    }
  }

  validateJestConfig = (jestConfig: IJestConfig): void => {
    const { lib } = jestConfig
    const requiredFields = { lib }
    this.validateRequiredFields('jest', requiredFields)

    if (typeof lib.runCLI !== 'function') {
      throw new ConfigurationError(`Invalid jest configuration, jest is missing runCLI method`)
    }
  }

  validateUserConfig = (config: IConfig): void => {
    const { runners, jest } = config

    if (!runners && !jest) {
      throw new ConfigurationError('Missing something to dockerize')
    }

    this.validateJestConfig(jest)
  }

  getConfig(): IConfig {
    return DockestConfig.config
  }
}

export default DockestConfig
