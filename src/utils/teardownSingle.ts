import { globalLogger } from '../loggers'
import { Runner } from '../runners/@types'
import { execaWrapper } from './index'

const teardownSingle = async (runner: Runner): Promise<void> => {
  const {
    containerId,
    runnerConfig: { service },
  } = runner

  if (!containerId) {
    globalLogger.error(`${service}: Cannot teardown container without a containerId`)

    return
  }

  await stopContainerById(runner)
  await removeContainerById(runner)
}

const stopContainerById = async (runner: Runner): Promise<void> => {
  const { containerId } = runner

  runner.runnerLogger.stopContainer()

  try {
    const command = `docker stop ${containerId}`

    await execaWrapper(command, runner)
  } catch (error) {
    runner.runnerLogger.stopContainerFailed()

    return
  }

  runner.runnerLogger.stopContainerSuccess()
}

const removeContainerById = async (runner: Runner): Promise<void> => {
  const { containerId } = runner

  runner.runnerLogger.removeContainer()

  try {
    const command = `docker rm ${containerId} --volumes`

    await execaWrapper(command, runner)
  } catch (error) {
    runner.runnerLogger.removeContainerFailed()

    return
  }

  runner.runnerLogger.removeContainerSuccess()
}

export default teardownSingle
