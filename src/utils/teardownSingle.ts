import { globalLogger, runnerLogger } from '../loggers'
import { execa } from './index'

const stopContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  runnerLogger.stopContainer()

  try {
    const cmd = `docker stop ${containerId}`

    await execa(cmd)
  } catch (error) {
    globalLogger.error(`${runnerKey}: Failed to stop service container`, error)

    return
  }

  runnerLogger.stopContainerSuccess()
}

const removeContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  runnerLogger.removeContainer()

  try {
    const cmd = `docker rm ${containerId} --volumes`

    await execa(cmd)
  } catch (error) {
    globalLogger.error(`${runnerKey}: Failed to remove service container`, error)

    return
  }

  runnerLogger.removeContainerSuccess()
}

const teardownSingle = async (containerId: string, runnerKey: string): Promise<void> => {
  if (!containerId) {
    globalLogger.error(`${runnerKey}: Cannot teardown container without a containerId`)

    return
  }

  runnerLogger.teardownSingle()
  await stopContainerById(containerId, runnerKey)
  await removeContainerById(containerId, runnerKey)
  runnerLogger.teardownSingleSuccess()
}

export default teardownSingle
