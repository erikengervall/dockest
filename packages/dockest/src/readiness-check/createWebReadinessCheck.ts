import { withRetry } from './withRetry'
import { withNoStop } from './withNoStop'
import { ReadinessCheck } from '../@types'
import { execaWrapper } from '../utils/execaWrapper'

const webReadinessCheck = (port: number): ReadinessCheck => async args => {
  const command = `docker exec ${args.runner.containerId} \
                          sh -c "wget --quiet --tries=1 --spider http://localhost:${port}/.well-known/healthcheck"`

  await execaWrapper(command, { runner: args.runner })
}

export const createWebReadinessCheck = (port = 3000, retryCount = 30): ReadinessCheck =>
  withNoStop(withRetry(webReadinessCheck(port), { retryCount }))
