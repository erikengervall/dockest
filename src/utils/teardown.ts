import execa from 'execa'

import { GlobalLogger, RunnerLogger } from '../loggers'

const teardownSingle = async (containerId: string, runnerKey: string): Promise<void> => {
  if (!containerId) {
    GlobalLogger.error(`${runnerKey}: Missing containerId for runner`)
    return
  }

  RunnerLogger.teardown(runnerKey)
  await stopContainerById(containerId, runnerKey)
  await removeContainerById(containerId, runnerKey)
  RunnerLogger.teardownSuccess(runnerKey)
}

const stopContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  RunnerLogger.stopContainer(runnerKey)

  try {
    const cmd = `docker stop ${containerId}`

    RunnerLogger.shellCmd(cmd)
    await execa.shell(cmd)
  } catch (error) {
    GlobalLogger.error(`${runnerKey}: Failed to stop service container`, error)
    return
  }

  RunnerLogger.stopContainerSuccess(runnerKey)
}

const removeContainerById = async (containerId: string, runnerKey: string): Promise<void> => {
  try {
    const cmd = `docker rm ${containerId} --volumes`

    RunnerLogger.shellCmd(cmd)
    await execa.shell(cmd)
  } catch (error) {
    GlobalLogger.error(`${runnerKey}: Failed to remove service container`, error)

    return
  }

  RunnerLogger.removeContainerSuccess(runnerKey)
}

export { teardownSingle }
