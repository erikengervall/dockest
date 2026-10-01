import { LogWriter } from './log-writer';
import { DockestConfig, Runner } from '../@types';
import { Logger } from '../logger';
import { leaveBridgeNetwork } from '../utils/network/leave-bridge-network';
import { removeBridgeNetwork } from '../utils/network/remove-bridge-network';
import { removeProjectNetworks } from '../utils/network/remove-project-networks';
import { teardownSingle } from '../utils/teardown-single';

const LOG_PREFIX = '[Teardown]';

const attempt = (description: string, step: () => void) => {
  try {
    step();
  } catch (error) {
    Logger.warn(`${LOG_PREFIX} Failed to ${description}: ${(error as Error).message}`);
  }
};

const getRunners = ({ runners, runnerLookupMap, teardownOrder }: DockestConfig['mutables']): Runner[] => {
  if (teardownOrder) {
    return teardownOrder
      .map((serviceName) => runnerLookupMap.get(serviceName))
      .filter((runner): runner is Runner => Boolean(runner));
  }

  // The lookup map also holds the `dependsOn` runners; it is empty until services start being waited for
  return runnerLookupMap.size > 0 ? Array.from(runnerLookupMap.values()) : Object.values(runners);
};

/**
 * Remove everything Dockest started. Best effort: every step runs even when an earlier one fails.
 *
 * The Docker work happens synchronously, before the returned promise (which flushes the container logs) is
 * awaited, so it completes even when called from a `process.on('exit')` listener.
 */
export const teardown = ({
  hostname,
  runMode,
  mutables,
  perfStart,
  logWriter,
}: {
  hostname: DockestConfig['hostname'];
  runMode: DockestConfig['runMode'];
  mutables: DockestConfig['mutables'];
  perfStart: DockestConfig['perfStart'];
  logWriter: LogWriter;
}): Promise<void> => {
  for (const runner of getRunners(mutables)) {
    teardownSingle({ runner });
  }

  if (runMode === 'docker-injected-host-socket') {
    attempt('leave the bridge network', () => leaveBridgeNetwork({ containerId: hostname }));
    attempt('remove the bridge network', () => removeBridgeNetwork());
  }

  if (mutables.composeProjectName) {
    const { composeProjectName } = mutables;
    attempt('remove the project networks', () => removeProjectNetworks(composeProjectName));
  }

  attempt('stop the Docker event stream', () => mutables.dockerEventEmitter.destroy());

  Logger.measurePerformance(perfStart);

  return logWriter.destroy();
};
