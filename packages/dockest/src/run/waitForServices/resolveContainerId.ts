import { DockestError } from '../../Errors'
import { execaWrapper } from '../../utils/execaWrapper'
import { GENERATED_COMPOSE_FILE_PATH } from '../../constants'
import { Runner } from '../../@types'
import { sleep } from '../../utils/sleep'

const logPrefix = '[Resolve Container Id]'

const getContainerId = async (runner: Runner) => {
  const {
    dockestService: { serviceName },
  } = runner
  const command = `docker-compose \
                    -f ${GENERATED_COMPOSE_FILE_PATH} \
                    ps \
                    -q \
                    "${serviceName}"`

  const { stdout } = await execaWrapper(command, { runner, logPrefix })

  return stdout
}

export const resolveContainerId = async (runner: Runner) => {
  const { logger } = runner
  const resolveContainerIdTimeout = 10
  let containerId = ''

  const recurse = async (resolveContainerIdTimeout: number) => {
    if (resolveContainerIdTimeout <= 0) {
      throw new DockestError('Timed out', { runner })
    }

    logger.debug(`${logPrefix} Timeout in ${resolveContainerIdTimeout}s`)

    try {
      containerId = await getContainerId(runner)

      if (typeof containerId !== 'string' || (typeof containerId === 'string' && containerId.length === 0)) {
        throw new DockestError(`Invalid containerId (${containerId})`, { runner })
      }

      logger.info(`${logPrefix} Success (${containerId})`, { success: true })
    } catch (error) {
      resolveContainerIdTimeout--

      await sleep(1000)
      await recurse(resolveContainerIdTimeout)
    }

    runner.containerId = containerId

    return containerId
  }

  return await recurse(resolveContainerIdTimeout)
}
