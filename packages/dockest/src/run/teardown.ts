import { LogWriter } from './log-writer';
import { DockestConfig } from '../@types';
import { DockestError } from '../errors';
import { Logger } from '../logger';
import { leaveBridgeNetwork } from '../utils/network/leave-bridge-network';
import { removeBridgeNetwork } from '../utils/network/remove-bridge-network';
import { teardownSingle } from '../utils/teardown-single';

export const teardown = async ({ config, logWriter }: { logWriter: LogWriter; config: DockestConfig }) => {
  if (config.mutables.teardownOrder) {
    for (const serviceName of config.mutables.teardownOrder) {
      const runner = config.mutables.runnerLookupMap.get(serviceName);
      if (!runner) {
        throw new DockestError('Could not find service in lookup map.');
      }
      await teardownSingle({ runner });
    }
  } else {
    for (const runner of config.mutables.runnerLookupMap.values()) {
      await teardownSingle({ runner });
    }
  }

  if (config.runMode === 'docker-injected-host-socket') {
    await leaveBridgeNetwork({ containerId: config.hostname });
    await removeBridgeNetwork();
  }

  config.mutables.dockerEventEmitter.destroy();
  await logWriter.destroy();

  Logger.measurePerformance(config.perfStart);
};
