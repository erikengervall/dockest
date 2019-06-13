import { DockestError } from '../../../errors'
import { runnerLogger } from '../../../loggers'
import { RunnerConfigs } from '../../index'
import { getContainerId, sleep } from '../index'

const resolveContainerId = async (runnerConfig: RunnerConfigs): Promise<string> => {
  const { service } = runnerConfig
  const timeout = 30

  let containerId = ''
  const recurse = async (timeout: number): Promise<string> => {
    runnerLogger.resolveContainerId(service)

    if (timeout <= 0) {
      throw new DockestError(`${service} getContainerId timed out`)
    }

    try {
      containerId = await getContainerId(service)

      if (
        typeof containerId !== 'string' ||
        (typeof containerId === 'string' && containerId.length === 0)
      ) {
        throw new Error('no bueno')
      }

      runnerLogger.resolveContainerIdSuccess(service, containerId)
    } catch (error) {
      timeout--

      await sleep(1000)
      await recurse(timeout)
    }

    return containerId
  }

  return recurse(timeout)
}

export default resolveContainerId
