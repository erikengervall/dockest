import { execaWrapper } from './execa-wrapper';
import { getComposeCommand } from './get-compose-command';
import { shellQuote } from './shell-quote';
import { Runner } from '../@types';
import { GENERATED_COMPOSE_FILE_PATH } from '../constants';

/**
 * The container can exist without Dockest having seen its start event, e.g. when startup timed out
 */
const findContainerIds = ({ serviceName }: Runner): string[] => {
  const { stdout } = execaWrapper(
    `${getComposeCommand()} -f ${shellQuote(GENERATED_COMPOSE_FILE_PATH)} ps --all --quiet ${serviceName}`,
    { execaOpts: { reject: false } },
  );

  return stdout.split('\n').filter(Boolean);
};

/**
 * Stop and remove the runner's container. Best effort: a failure is logged, never thrown, so the remaining
 * runners are still torn down.
 */
export const teardownSingle = ({ runner }: { runner: Runner }): void => {
  const containerIds = runner.containerId ? [runner.containerId] : findContainerIds(runner);

  if (containerIds.length === 0) {
    runner.logger.debug('[Teardown] No container to remove');
    return;
  }

  for (const containerId of containerIds) {
    try {
      execaWrapper(`docker stop ${containerId}`, { runner, logPrefix: '[Stop Container]', logStdout: true });
      execaWrapper(`docker rm ${containerId} --volumes`, { runner, logPrefix: '[Remove Container]', logStdout: true });
    } catch (error) {
      runner.logger.warn(`[Teardown] Failed to remove container ${containerId}: ${(error as Error).message}`);
    }
  }
};
