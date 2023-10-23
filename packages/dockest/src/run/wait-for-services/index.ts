import toposort from 'toposort';
import { checkConnection } from './check-connection';
import { dockerComposeUp } from './docker-compose-up';
import { fixRunnerHostAccessOnLinux } from './fix-runner-host-access-on-linux';
import { resolveContainerId } from './resolve-container-id';
import { runReadinessCheck } from './run-readiness-check';
import { runRunnerCommands } from './run-runner-commands';
import { DockestConfig, Runner } from '../../@types';
import { DOCKEST_HOST_ADDRESS } from '../../constants';
import { DockestError } from '../../errors';
import { bridgeNetworkExists } from '../../utils/network/bridge-network-exists';
import { createBridgeNetwork } from '../../utils/network/create-bridge-network';
import { joinBridgeNetwork } from '../../utils/network/join-bridge-network';
import { LogWriter } from '../log-writer';

const LOG_PREFIX = '[Setup]';

export const waitForServices = async ({
  config: { composeOpts, hostname, runMode, mutables, runInBand, skipCheckConnection },
  logWriter,
}: {
  config: DockestConfig;
  logWriter: LogWriter;
}) => {
  const waitForRunner = async ({ runner, runner: { isBridgeNetworkMode, serviceName } }: { runner: Runner }) => {
    runner.logger.debug(`${LOG_PREFIX} Initiating...`);

    await dockerComposeUp({ composeOpts, serviceName });
    await resolveContainerId({ runner });

    logWriter.register(runner.serviceName, runner.containerId);

    if (isBridgeNetworkMode) {
      await joinBridgeNetwork({ containerId: runner.containerId, alias: serviceName });
    }

    if (process.platform === 'linux' && !isBridgeNetworkMode) {
      await fixRunnerHostAccessOnLinux(runner);
    }

    if (skipCheckConnection) {
      runner.logger.debug(`${LOG_PREFIX} Skip connection check.`);
    } else {
      await checkConnection({ runner });
    }
    await runReadinessCheck({ runner });
    await runRunnerCommands({ runner });

    runner.logger.info(`${LOG_PREFIX} Success`, { success: true, endingNewLines: 1 });
  };

  if (runMode === 'docker-injected-host-socket') {
    if (!(await bridgeNetworkExists())) {
      await createBridgeNetwork();
    }

    await joinBridgeNetwork({ containerId: hostname, alias: DOCKEST_HOST_ADDRESS });
  }

  const dependencyGraph: Array<[string, string | undefined]> = [];

  const walkRunner = (runner: Runner) => {
    if (mutables.runnerLookupMap.has(runner.serviceName)) {
      return;
    }
    mutables.runnerLookupMap.set(runner.serviceName, runner);

    if (runner.dependsOn.length === 0) {
      dependencyGraph.push([runner.serviceName, undefined]);
    } else {
      for (const dependencyRunner of runner.dependsOn) {
        dependencyGraph.push([dependencyRunner.serviceName, runner.serviceName]);
        walkRunner(dependencyRunner);
      }
    }
  };

  for (const runner of Object.values(mutables.runners)) {
    walkRunner(runner);
  }

  if (runInBand) {
    const ordered: Array<string> = toposort(dependencyGraph).filter((value) => value !== undefined);

    const teardownOrder = ordered.slice(0).reverse();
    mutables.teardownOrder = teardownOrder;

    for (const serviceName of ordered) {
      const runner = mutables.runnerLookupMap.get(serviceName);
      if (!runner) {
        throw new DockestError('Unexpected error. Runner could not be found.');
      }
      await waitForRunner({ runner });
    }
  } else {
    await Promise.all(Array.from(mutables.runnerLookupMap.values()).map((runner) => waitForRunner({ runner })));
  }
};
