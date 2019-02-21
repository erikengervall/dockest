import execa from 'execa'

import { globalLogger, runnerLogger } from '../../loggers'

const stopContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  runnerLogger.stopContainer(runnerKey)

  try {
    const cmd = `docker stop ${containerId}`

    runnerLogger.shellCmd(cmd)
    await execa.shell(cmd)
  } catch (error) {
    globalLogger.error(`${runnerKey}: Failed to stop service container`, error)
    return
  }

  runnerLogger.stopContainerSuccess(runnerKey)
}

const removeContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  runnerLogger.removeContainer(runnerKey)

  try {
    const cmd = `docker rm ${containerId} --volumes`

    runnerLogger.shellCmd(cmd)
    await execa.shell(cmd)
  } catch (error) {
    globalLogger.error(`${runnerKey}: Failed to remove service container`, error)

    return
  }

  runnerLogger.removeContainerSuccess(runnerKey)
}

export default async (containerId: string, runnerKey: string): Promise<void> => {
  if (!containerId) {
    globalLogger.error(`${runnerKey}: Cannot teardown container without a containerId`)
    return
  }

  runnerLogger.teardown(runnerKey)
  await stopContainerById(containerId, runnerKey)
  await removeContainerById(containerId, runnerKey)
  runnerLogger.teardownSuccess(runnerKey)
}
