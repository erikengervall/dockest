import { execaWrapper } from './execaWrapper'
import { Runner } from '../@types'
import { DockestError } from '../Errors'

const stopContainerById = async (runner: Runner) => {
  const { containerId } = runner
  const logPrefix = '[Stop Container]'
  const command = `docker stop ${containerId}`

  await execaWrapper(command, { runner, logPrefix, logStdout: true })
}

const removeContainerById = async (runner: Runner) => {
  const { containerId } = runner
  const logPrefix = '[Remove Container]'

  const command = `docker rm ${containerId} --volumes`
  await execaWrapper(command, { runner, logPrefix, logStdout: true })
}

export const teardownSingle = async (runner: Runner) => {
  const { containerId, serviceName } = runner

  if (!containerId) {
    throw new DockestError(`Invalid containerId (${containerId}) for service (${serviceName})`, { runner })
  }

  await stopContainerById(runner)
  await removeContainerById(runner)
}
