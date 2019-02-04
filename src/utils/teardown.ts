import execa from 'execa'

import logger from './logger'

const teardownSingle = async (containerId: string, runnerKey: string): Promise<void> => {
  if (!containerId) {
    logger.error(`${runnerKey}: Missing containerId for runner`)
    return
  }

  logger.teardown.teardown(runnerKey)
  await stopContainerById(containerId, runnerKey)
  await removeContainerById(containerId, runnerKey)
  logger.teardown.teardownSuccess(runnerKey)
}

const stopContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  logger.teardown.stopContainer(runnerKey)

  try {
    const cmd = `docker stop ${containerId}`

    logger.shellCmd(cmd)
    await execa.shell(cmd)
  } catch (error) {
    logger.error(`${runnerKey}: Failed to stop service container`, error)
    return
  }

  logger.teardown.stopContainerSuccess(runnerKey)
}

const removeContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  try {
    const cmd = `docker rm ${containerId} --volumes`

    logger.shellCmd(cmd)
    await execa.shell(cmd)
  } catch (error) {
    logger.error(`${runnerKey}: Failed to remove service container`, error)

    return
  }

  logger.teardown.removeContainerSuccess(runnerKey)
}

export { teardownSingle }
