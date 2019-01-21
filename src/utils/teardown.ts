import execa from 'execa'

import logger from './logger'

const teardownSingle = async (containerId: string, runnerKey: string): Promise<void> => {
  if (!containerId) {
    logger.error(`Missing containerId for runner "${runnerKey}"`)
    return
  }

  await stopContainerById(containerId, runnerKey)
  await removeContainerById(containerId, runnerKey)
}

const stopContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  try {
    await execa.shell(`docker stop ${containerId}`)
  } catch (error) {
    logger.error(`Failed to stop service container ${runnerKey}`, error)
    return
  }

  logger.loading(`Stopped service container "${runnerKey}" `)
}

const removeContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  try {
    await execa.shell(`docker rm ${containerId} --volumes`)
  } catch (error) {
    logger.error(`Failed to remove service container ${runnerKey}`, error)
    return
  }

  logger.loading(`Removed service container "${runnerKey}"`)
}

export { teardownSingle }
