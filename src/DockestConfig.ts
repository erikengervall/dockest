import merge from 'deepmerge'
import fs from 'fs'

import ConfigurationError from './error/ConfigurationError'

export interface IPostgresConfig {
  label: string; // Used for getting containerId using --filter
  service: string; // dockest-compose service name
  commands?: string[]; // Run custom scripts (migrate/seed)
  connectionTimeout?: number;
  responsivenessTimeout?: number;
  // Connection
  host: string;
  db: string;
  port: number;
  password: string;
  username: string;
}
export interface IPostgresConfig$Int extends IPostgresConfig {
  $containerId?: string;
}

export interface IJestConfig {
  lib: {
    SearchSource: any,
    TestScheduler: any,
    TestWatcher: any,
    getVersion: any,
    run: any,
    runCLI: any,
  };
  silent?: boolean;
  verbose?: boolean;
  forceExit?: boolean;
  watchAll?: boolean;
  projects: string[];
}

export interface IConfig {
  jest: IJestConfig;
  dockest: {
    verbose?: boolean,
    exitHandler?: (err?: Error) => void,
    dockerComposeFilePath?: string,
  };
  postgres: IPostgresConfig[];
}
export interface IConfig$Int extends IConfig {
  postgres: IPostgresConfig$Int[];
}

const DEFAULT_CONFIG = {
  jest: {
    projects: ['.'],
  },
  dockest: {
    verbose: false,
  },
  postgres: [],
}

export class DockestConfig {
  config: IConfig$Int

  constructor(userConfig?: IConfig) {
    const dockestRcFilePath = `${process.cwd()}/.dockestrc.js`

    if (userConfig && typeof userConfig === 'object') {
      this.config = userConfig
    } else if (fs.existsSync(dockestRcFilePath)) {
      this.config = require(dockestRcFilePath)
    } else {
      throw new ConfigurationError('Could not find ".dockestrc.js"')
    }

    if (this.config && typeof this.config === 'object') {
      this.config = merge(DEFAULT_CONFIG, this.config)
    } else {
      throw new ConfigurationError('Configuration step failed')
    }

    this.validateUserConfig(this.config)
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

  validatePostgresConfigs = (postgresConfigs: IPostgresConfig[]): void =>
    postgresConfigs.forEach(({ label, service, host, db, port, password, username }) => {
      const requiredFields = { label, service, host, db, port, password, username }
      this.validateRequiredFields('postgres', requiredFields)
    })

  validateJestConfig = (jestConfig: IJestConfig): void => {
    const { lib } = jestConfig
    const requiredFields = { lib }
    this.validateRequiredFields('jest', requiredFields)

    if (typeof lib.runCLI !== 'function') {
      throw new ConfigurationError(`Invalid jest configuration, jest is missing runCLI method`)
    }
  }

  validateUserConfig = (config: IConfig): void => {
    const { postgres, jest } = config

    if (!postgres && !jest) {
      throw new ConfigurationError('Missing something to dockerize')
    }

    this.validatePostgresConfigs(postgres)
    this.validateJestConfig(jest)

    if (!postgres) {
      config.postgres = []
    }
  }

  getConfig(): IConfig$Int {
    return this.config
  }
}

export default DockestConfig
