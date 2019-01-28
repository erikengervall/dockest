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
    const cmd = `docker stop ${containerId}`
    logger.command(cmd)
    await execa.shell(cmd)
  } catch (error) {
    logger.error(`Failed to stop service container "${runnerKey}"`, error)
    return
  }

  logger.loading(`Stopped service container "${runnerKey}" `)
}

const removeContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  try {
    const cmd = `docker rm ${containerId} --volumes`
    logger.command(cmd)
    await execa.shell(cmd)
  } catch (error) {
    logger.error(`Failed to remove service container "${runnerKey}"`, error)
    return
  }

  logger.loading(`Removed service container "${runnerKey}"`)
}

export { teardownSingle }
