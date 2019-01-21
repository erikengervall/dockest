import execa from 'execa'

import { DockestError } from '../errors'
import logger from './logger'

const teardownSingle = async (containerId: string, runnerKey: string): Promise<void> => {
  if (!containerId) {
    throw new DockestError(`No containerId`)
  }

  await stopContainerById(containerId, runnerKey)
  await removeContainerById(containerId, runnerKey)
}

const stopContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  await execa.shell(`docker stop ${containerId}`)

  logger.loading(`Stopped service container: "${runnerKey}" `)
}

const removeContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  await execa.shell(`docker rm ${containerId} --volumes`)

  logger.loading(`Removed service container: "${runnerKey}"`)
}

export { teardownSingle }
