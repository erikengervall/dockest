import { execaWrapper } from './execaWrapper'
import { Runner } from '../@types'
import { DockestError } from '../Errors'

const stopContainerById = async ({ runner, runner: { containerId } }: { runner: Runner }) => {
  const command = `docker stop ${containerId}`

  await execaWrapper(command, { runner, logPrefix: '[Stop Container]', logStdout: true })
}

const removeContainerById = async ({ runner, runner: { containerId } }: { runner: Runner }) => {
  const command = `docker rm ${containerId} --volumes`

  await execaWrapper(command, { runner, logPrefix: '[Remove Container]', logStdout: true })
}

export const teardownSingle = async ({
  runner,
  runner: { containerId, dependents, serviceName },
}: {
  runner: Runner
}) => {
  if (!containerId) {
    throw new DockestError(`Invalid containerId (${containerId}) for service (${serviceName})`, { runner })
  }

  for (const dependant of dependents) {
    await teardownSingle({ runner: dependant })
  }

  await stopContainerById({ runner })
  await removeContainerById({ runner })
}
