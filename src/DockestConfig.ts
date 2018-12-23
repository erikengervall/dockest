import fs from 'fs'

import ConfigurationError from './error/ConfigurationError'

export interface IPostgresConfig {
  label: string; // Used for getting containerId using --filter
  seeder: string; // Filename of seeder (sequelize specific)
  service: string; // dockest-compose service name
  cmds?: string[]; // Migrations, Seeders
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
  $: {
    containerId: string,
  };
}

export interface IRedisConfig {
  connectionTimeout?: number;
  label: string;
  port: number;
}
export interface IRedisConfig$Int extends IRedisConfig {
  $: {
    containerId: string,
  };
}

export interface IKafkaConfig {
  connectionTimeout?: number;
  label: string;
  topic: string;
  port: number;
}
export interface IKafkaConfig$Int extends IKafkaConfig {
  $: {
    containerId: string,
  };
}

export interface IConfig {
  jest: {
    jest: any,
    silent?: boolean,
    verbose?: boolean,
    forceExit?: boolean,
    watchAll?: boolean,
    projects: string[],
  };
  dockest: {
    verbose?: boolean,
    exitHandler?: () => void,
    dockerComposeFile?: string,
  };
  postgres: IPostgresConfig[];
  redis: IRedisConfig[];
  kafka: IKafkaConfig[];
}
export interface IConfig$Int extends IConfig {
  postgres: IPostgresConfig$Int[];
  redis: IRedisConfig$Int[];
  kafka: IKafkaConfig$Int[];
}

type validateConfig = (config: IConfig) => void

const DEFAULT_CONFIG = {
  jest: {
    projects: ['.'],
    $: {},
  },
  dockest: {
    verbose: false,
    $: {},
  },
  postgres: [{ $: {} }],
  redis: [{ $: {} }],
  kafka: [{ $: {} }],
}

const validateConfig: validateConfig = config => {
  if (!config.postgres && !config.kafka) {
    throw new ConfigurationError('Missing something to dockerize')
  }

  if (!config.postgres) {
    config.postgres = []
  }
  if (!config.redis) {
    config.redis = []
  }
  if (!config.kafka) {
    config.kafka = []
  }
}

export class DockestConfig {
  config: IConfig$Int

  constructor(userConfig?: IConfig) {
    const cwd = process.cwd()
    let configRc

    if (userConfig) {
      configRc = userConfig
    } else if (fs.existsSync(`${cwd}/.dockestrc.js`)) {
      configRc = require(`${cwd}/.dockestrc.js`)
    } else {
      throw new ConfigurationError('Could not find ".dockestrc.js"')
    }

    if (configRc && typeof configRc === 'object') {
      this.config = {
        ...DEFAULT_CONFIG,
        ...configRc,
      }
      this.config.postgres.map(p => (p.$ = { containerId: '' }))
      this.config.redis.map(r => (r.$ = { containerId: '' }))
      this.config.kafka.map(k => (k.$ = { containerId: '' }))
    } else {
      throw new ConfigurationError('Something went wrong when attempting to parse ".dockestrc.js"')
    }

    validateConfig(this.config)
  }

  getConfig(): IConfig$Int {
    return this.config
  }
}

export default DockestConfig
