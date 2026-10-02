import { DockerComposeFile, TestRunModeType } from '../@types';
import { DEFAULT_HOST_NAME, DOCKEST_ATTACH_TO_PROCESS, DOCKEST_HOST_ADDRESS } from '../constants';
import { DockestError } from '../errors';
import { getRunMode as _getRunMode } from '../utils/get-run-mode';

let runMode: TestRunModeType | null = null;

const getRunMode = (): TestRunModeType => {
  if (!runMode) {
    runMode = _getRunMode();
  }
  return runMode;
};

const dockestConfig = process.env[DOCKEST_ATTACH_TO_PROCESS];

if (!dockestConfig) {
  throw new DockestError('Config not attached to process: Not executed inside dockest context');
}

const config: DockerComposeFile = JSON.parse(dockestConfig);

export const getHostAddress = () => {
  if (getRunMode() !== 'docker-injected-host-socket') {
    return DEFAULT_HOST_NAME;
  }
  return DOCKEST_HOST_ADDRESS;
};

const getService = (serviceName: string) => {
  const service = config.services[serviceName];
  if (!service) {
    throw new DockestError(`Service "${serviceName}" does not exist`);
  }
  return service;
};

export const resolveServiceAddress = (serviceName: string, targetPort: number | string) => {
  const service = getService(serviceName);

  const portBinding = (service.ports || []).find((portBinding) => portBinding.target === Number(targetPort));
  if (!portBinding) {
    throw new DockestError(`Service "${serviceName}" has no target port ${targetPort}`);
  }

  if (getRunMode() === 'docker-injected-host-socket') {
    return { host: serviceName, port: portBinding.target };
  }

  if (portBinding.published === undefined) {
    throw new DockestError(
      `Service "${serviceName}" does not publish target port ${targetPort} on a fixed host port. Set \`published\` in the Compose file.`,
    );
  }

  return { host: 'localhost', port: portBinding.published };
};

export const getServiceAddress = (serviceName: string, targetPort: number | string) => {
  const record = resolveServiceAddress(serviceName, targetPort);
  return `${record.host}:${record.port}`;
};

/** The value of an environment variable set on a service in the Compose file */
export const getServiceEnvironmentVariable = (serviceName: string, variableName: string): string => {
  const value = (getService(serviceName).environment || {})[variableName];
  if (value === undefined || value === null) {
    throw new DockestError(`Service "${serviceName}" has no value for environment variable "${variableName}"`);
  }
  return String(value);
};
