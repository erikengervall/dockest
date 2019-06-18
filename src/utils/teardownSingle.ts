import { globalLogger } from '../loggers'
import { Runner } from '../runners/index'
import { execa } from './index'

const teardownSingle = async (runner: Runner): Promise<void> => {
  const {
    containerId,
    runnerConfig: { service },
  } = runner

  if (!containerId) {
    globalLogger.error(`${service}: Cannot teardown container without a containerId`)

    return
  }

  runner.runnerLogger.teardownSingle()
  await stopContainerById(runner)
  await removeContainerById(runner)
  runner.runnerLogger.teardownSingleSuccess()
}

const stopContainerById = async (runner: Runner): Promise<void> => {
  const {
    containerId,
    runnerConfig: { service },
  } = runner

  runner.runnerLogger.stopContainer()

  try {
    const cmd = `docker stop ${containerId}`

    await execa(cmd)
  } catch (error) {
    globalLogger.error(`${service}: Failed to stop service container`, error)

    return
  }

  runner.runnerLogger.stopContainerSuccess()
}

const removeContainerById = async (runner: Runner): Promise<void> => {
  const {
    containerId,
    runnerConfig: { service },
  } = runner

  runner.runnerLogger.removeContainer()

  try {
    const cmd = `docker rm ${containerId} --volumes`

    await execa(cmd)
  } catch (error) {
    globalLogger.error(`${service}: Failed to remove service container`, error)

    return
  }

  runner.runnerLogger.removeContainerSuccess()
}

export default teardownSingle
