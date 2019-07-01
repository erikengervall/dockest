import { DockestError } from '../errors'
import { Runner } from '../runners/@types'
import { execaWrapper, sleep } from './index'

const resolveContainerId = async (runner: Runner): Promise<void> => {
  const {
    runnerLogger,
    runnerConfig: { service },
  } = runner
  const resolveContainerIdTimeout = 10
  let containerId = ''

  const recurse = async (resolveContainerIdTimeout: number): Promise<void> => {
    runnerLogger.resolveContainerId()

    if (resolveContainerIdTimeout <= 0) {
      throw new DockestError(
        `${service}: Timed out (${resolveContainerIdTimeout}s) while trying to resolve containerId`
      )
    }

    try {
      containerId = await getContainerId(runner)

      if (
        typeof containerId !== 'string' ||
        (typeof containerId === 'string' && containerId.length === 0)
      ) {
        throw new Error(`Invalid containerId: ${containerId}`)
      }

      runnerLogger.resolveContainerIdSuccess(containerId)
    } catch (error) {
      resolveContainerIdTimeout--

      await sleep(1000)
      await recurse(resolveContainerIdTimeout)
    }

    runner.containerId = containerId
  }

  await recurse(resolveContainerIdTimeout)
}

const getContainerId = async (runner: Runner): Promise<string> => {
  const {
    runnerConfig: { service },
  } = runner
  const command = ` \
                docker ps \
                  --quiet \
                  --filter \
                  "name=${service}" \
                --latest \
              `

  const containerId = await execaWrapper(command, runner)

  return containerId
}

const testables = { getContainerId }
export { testables }
export default resolveContainerId
