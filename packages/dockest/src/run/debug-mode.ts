import { DockestConfig } from '../@types';
import { Logger } from '../logger';
import { sleep } from '../utils/sleep';

export const debugMode = async ({ config }: { config: DockestConfig }) => {
  if (config.debug) {
    Logger.info(`Debug mode enabled, containers are kept running and Jest will not run.`);

    Object.values(config.mutables.runners).forEach((runner) =>
      Logger.info(`[${runner.serviceName}]: ${runner.containerId}`),
    );

    await sleep(1000 * 60 * 60 * 24);
  }
};
