import { execaWrapper } from './execa-wrapper';
import { Runner } from '../@types';
import { DockestError } from '../errors';

const stopContainerById = async ({ runner, runner: { containerId } }: { runner: Runner }) => {
  const command = `docker stop ${containerId}`;

  execaWrapper(command, { runner, logPrefix: '[Stop Container]', logStdout: true });
};

const removeContainerById = async ({ runner, runner: { containerId } }: { runner: Runner }) => {
  const command = `docker rm ${containerId} --volumes`;

  execaWrapper(command, { runner, logPrefix: '[Remove Container]', logStdout: true });
};

export const teardownSingle = async ({ runner, runner: { containerId, serviceName } }: { runner: Runner }) => {
  if (!containerId) {
    throw new DockestError(`Invalid containerId (${containerId}) for service (${serviceName})`, { runner });
  }

  await stopContainerById({ runner });
  await removeContainerById({ runner });
};
