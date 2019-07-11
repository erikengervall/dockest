import DockestError from '../../errors/DockestError'
import { Runner } from '../../runners/@types'
import execaWrapper from '../../utils/execaWrapper'
import sleep from '../../utils/sleep'

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

export default async (runner: Runner): Promise<void> => {
  const {
    logger,
    runnerConfig: { service },
  } = runner
  const resolveContainerIdTimeout = 10
  let containerId = ''

  const recurse = async (resolveContainerIdTimeout: number): Promise<void> => {
    logger.info('Attempting to resolve containerId')

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

      logger.info(`Found containerId: ${containerId}`)
    } catch (error) {
      resolveContainerIdTimeout--

      await sleep(1000)
      await recurse(resolveContainerIdTimeout)
    }

    runner.containerId = containerId
  }

  await recurse(resolveContainerIdTimeout)
}

const testables = { getContainerId }
export { testables }
