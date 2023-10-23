export const LOG_LEVEL = {
  NOTHING: 0,
  ERROR: 1,
  WARN: 2,
  INFO: 3,
  DEBUG: 4,
};

export const GENERATED_COMPOSE_FILE_PATH = `${process.cwd()}/docker-compose.dockest-generated.yml`;

export const DOCKEST_ATTACH_TO_PROCESS = 'DOCKEST_ATTACH_TO_PROCESS';

export const BRIDGE_NETWORK_NAME = `dockest_bridge_network`;

export const DOCKEST_HOST_ADDRESS = 'host.dockest-runner.internal';
export const DEFAULT_HOST_NAME = 'host.docker.internal';

/**
 * Released 2017-05-06: https://github.com/facebook/jest/releases/tag/v20.0.0
 */
export const MINIMUM_JEST_VERSION = '20.0.0';
