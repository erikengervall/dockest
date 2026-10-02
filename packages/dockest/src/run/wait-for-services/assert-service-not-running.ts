import { Runner } from '../../@types';
import { GENERATED_COMPOSE_FILE_PATH } from '../../constants';
import { DockestError } from '../../errors';
import { execaWrapper } from '../../utils/execa-wrapper';
import { getComposeCommand } from '../../utils/get-compose-command';
import { shellQuote } from '../../utils/shell-quote';

const LOG_PREFIX = '[Assert Not Running]';

const lines = (stdout: string) => stdout.split('\n').filter(Boolean);

const getRunningContainerIds = ({
  runner,
  composeProjectName,
}: {
  runner: Runner;
  composeProjectName: string | null;
}) => {
  const { serviceName } = runner;
  const execaOpts = { reject: false };

  if (composeProjectName) {
    const labels = [`com.docker.compose.project=${composeProjectName}`, `com.docker.compose.service=${serviceName}`];
    const filters = labels.map((label) => `--filter ${shellQuote(`label=${label}`)}`).join(' ');
    return lines(execaWrapper(`docker ps --quiet ${filters}`, { runner, execaOpts }).stdout);
  }

  // The standalone docker-compose binary reports no project name, and its `ps` also lists stopped containers
  const serviceContainerIds = lines(
    execaWrapper(
      `${getComposeCommand()} -f ${shellQuote(GENERATED_COMPOSE_FILE_PATH)} ps --quiet ${shellQuote(serviceName)}`,
      { runner, execaOpts },
    ).stdout,
  );
  if (serviceContainerIds.length === 0) {
    return [];
  }

  const runningContainerIds = lines(execaWrapper('docker ps --quiet --no-trunc', { runner, execaOpts }).stdout);
  return serviceContainerIds.filter((containerId) => runningContainerIds.includes(containerId));
};

/**
 * `docker compose up` leaves an already running container alone and Docker emits no `start` event for it, so waiting
 * for one would only time out. Fail right away instead, and say how to get out of it.
 */
export const assertServiceNotRunning = ({
  runner,
  composeProjectName,
}: {
  runner: Runner;
  composeProjectName: string | null;
}) => {
  const runningContainerIds = getRunningContainerIds({ runner, composeProjectName });
  if (runningContainerIds.length === 0) {
    runner.logger.debug(`${LOG_PREFIX} No running container`);
    return;
  }

  throw new DockestError(
    `Service "${runner.serviceName}" is already running (container ${runningContainerIds[0].slice(0, 12)}), ` +
      'so Docker sends no start event to wait for. Stop it first, for example with `docker compose down`.',
    { runner },
  );
};
