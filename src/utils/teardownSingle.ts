import { Runner } from '../runners/@types'
import execaWrapper from './execaWrapper'

const teardownSingle = async (runner: Runner): Promise<void> => {
  const { containerId, logger } = runner

  if (!containerId) {
    logger.error('Cannot teardown container without a containerId')
    return
  }

  // Teardown runner's dependencies
  for (const depRunner of runner.runnerConfig.dependsOn) {
    const { logger } = depRunner

    logger.info('Container teared down')
    await stopContainerById(depRunner)
    await removeContainerById(depRunner)
    logger.info('Container teared down')
  }

  // Teardown runner
  logger.info('Container teared down')
  await stopContainerById(runner)
  await removeContainerById(runner)
  logger.info('Container teared down')
}

const stopContainerById = async (runner: Runner): Promise<void> => {
  const { containerId, logger } = runner
  logger.debug('Container being stopped')

  try {
    const command = `docker stop ${containerId}`

    await execaWrapper(command, runner)
  } catch (error) {
    logger.error('Unexpected error when stopping container')

    return
  }

  logger.debug('Container stopped')
}

const removeContainerById = async (runner: Runner): Promise<void> => {
  const { containerId, logger } = runner
  logger.debug('Container being removed')

  try {
    const command = `docker rm ${containerId} --volumes`

    await execaWrapper(command, runner)
  } catch (error) {
    logger.error('Unexpected error when removing container')

    return
  }

  logger.debug('Container removed')
}

export default teardownSingle
