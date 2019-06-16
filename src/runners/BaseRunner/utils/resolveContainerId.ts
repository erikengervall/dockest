import { DockestError } from '../../../errors'
import { runnerLogger } from '../../../loggers'
import { execa, sleep } from '../../../utils/index'

const resolveContainerId = async (service: string): Promise<string> => {
  const timeout = 30

  let containerId = ''
  const recurse = async (timeout: number): Promise<string> => {
    runnerLogger.resolveContainerId(service)

    if (timeout <= 0) {
      throw new DockestError(`${service} getContainerId timed out`)
    }

    try {
      containerId = await getContainerId(service)
      console.log({ typeof: typeof containerId !== 'string', containerId, len: containerId.length })

      if (
        typeof containerId !== 'string' ||
        (typeof containerId === 'string' && containerId.length === 0)
      ) {
        throw new Error('Could not resolve')
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

const getContainerId = async (serviceName: string): Promise<string> => {
  const cmd = `docker ps \
                  --quiet \
                  --filter \
                  "name=${serviceName}" \
                  --latest`
  const containerId = await execa(cmd)

  return containerId
}

const testables = { getContainerId }
export { testables }
export default resolveContainerId
