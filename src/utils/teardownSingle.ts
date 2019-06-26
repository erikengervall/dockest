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

  runner.runnerLogger.teardownSingle()

  await stopContainerById(runner)
  await removeContainerById(runner)

  runner.runnerLogger.teardownSingleSuccess()
}

const stopContainerById = async (runner: Runner): Promise<void> => {
  const { containerId } = runner

  runner.runnerLogger.stopContainer()

  try {
    const cmd = `docker stop ${containerId}`

    await execaWrapper(cmd, runner)
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
    const cmd = `docker rm ${containerId} --volumes`

    await execaWrapper(cmd, runner)
  } catch (error) {
    runner.runnerLogger.removeContainerFailed()

    return
  }

  runner.runnerLogger.removeContainerSuccess()
}

export default teardownSingle
