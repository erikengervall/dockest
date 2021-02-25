import { withRetry } from './withRetry'
import { withNoStop } from './withNoStop'
import { ReadinessCheck, Runner } from '../@types'
import { execaWrapper } from '../utils/execaWrapper'
import { selectPortMapping } from '../utils/selectPortMapping'

type PortConfig = number | ((runner: Runner) => MaybePromise<number>)
type MaybePromise<T> = T | Promise<T>

const defaultPortConfig: PortConfig = runner => selectPortMapping(runner.dockerComposeFileService.ports[0]).target

const redisReadinessCheck = (portConfig: PortConfig): ReadinessCheck => async args => {
  const port = await (typeof portConfig === 'function' ? portConfig(args.runner) : portConfig)
  const command = `docker exec ${args.runner.containerId} redis-cli \
                        -h localhost \
                        -p ${port} \
                        PING`

  await execaWrapper(command, { runner: args.runner })
}

export const createRedisReadinessCheck = (
  portConfig: PortConfig = defaultPortConfig,
  retryCount = 30,
): ReadinessCheck =>
  withNoStop(
    withRetry(redisReadinessCheck(portConfig), {
      retryCount,
    }),
  )
