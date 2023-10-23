import { LogWriter } from './log-writer';
import { DockestConfig } from '../@types';
import { DockestError } from '../errors';
import { Logger } from '../logger';
import { leaveBridgeNetwork } from '../utils/network/leave-bridge-network';
import { removeBridgeNetwork } from '../utils/network/remove-bridge-network';
import { teardownSingle } from '../utils/teardown-single';

export const teardown = async ({
  config: {
    hostname,
    runMode,
    mutables: { runnerLookupMap, dockerEventEmitter, teardownOrder },
    perfStart,
  },
  logWriter,
}: {
  logWriter: LogWriter;
  config: DockestConfig;
}) => {
  if (teardownOrder) {
    for (const serviceName of teardownOrder) {
      const runner = runnerLookupMap.get(serviceName);
      if (!runner) {
        throw new DockestError('Could not find service in lookup map.');
      }
      await teardownSingle({ runner });
    }
  } else {
    for (const runner of runnerLookupMap.values()) {
      await teardownSingle({ runner });
    }
  }

  if (runMode === 'docker-injected-host-socket') {
    await leaveBridgeNetwork({ containerId: hostname });
    await removeBridgeNetwork();
  }

  dockerEventEmitter.destroy();
  await logWriter.destroy();

  Logger.measurePerformance(perfStart);
};
