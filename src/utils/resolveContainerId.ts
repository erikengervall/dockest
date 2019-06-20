import { DockestError } from '../errors'
import { Runner } from '../runners'
import { execaWrapper, sleep } from './index'

const resolveContainerId = async (runner: Runner): Promise<void> => {
  const {
    runnerConfig: { service },
    runnerLogger,
  } = runner
  const timeout = 30
  let containerId = ''

  const recurse = async (timeout: number): Promise<void> => {
    runnerLogger.resolveContainerId()

    if (timeout <= 0) {
      throw new DockestError(`${service} getContainerId timed out`)
    }

    try {
      containerId = await getContainerId(runner)

      if (
        typeof containerId !== 'string' ||
        (typeof containerId === 'string' && containerId.length === 0)
      ) {
        throw new Error('Could not resolve')
      }

      runnerLogger.resolveContainerIdSuccess(containerId)
    } catch (error) {
      timeout--

      await sleep(1000)
      await recurse(timeout)
    }

    runner.containerId = containerId
  }

  recurse(timeout)
}

const getContainerId = async (runner: Runner): Promise<string> => {
  const {
    runnerConfig: { service },
  } = runner
  const cmd = `docker ps \
                  --quiet \
                  --filter \
                  "name=${service}" \
                  --latest`

  const containerId = await execaWrapper(cmd, runner)

  return containerId
}

const testables = { getContainerId }
export { testables }
export default resolveContainerId
