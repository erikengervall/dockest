import execa from 'execa'

import logger from './logger'

const teardownSingle = async (containerId: string, runnerKey: string): Promise<void> => {
  if (!containerId) {
    logger.error(`${runnerKey}: Missing containerId for runner`)
    return
  }

  await stopContainerById(containerId, runnerKey)
  await removeContainerById(containerId, runnerKey)
}

const stopContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  logger.stopContainer(runnerKey)

  try {
    const cmd = `docker stop ${containerId}`
    logger.command(cmd)
    await execa.shell(cmd)
  } catch (error) {
    logger.error(`${runnerKey}: Failed to stop service container`, error)
    return
  }

  logger.stopContainerSuccess(runnerKey)
}

const removeContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  try {
    const cmd = `docker rm ${containerId} --volumes`
    logger.command(cmd)
    await execa.shell(cmd)
  } catch (error) {
    logger.error(`${runnerKey}: Failed to remove service container`, error)
    return
  }

  logger.removeContainerSuccess(runnerKey)
}

export { teardownSingle }
