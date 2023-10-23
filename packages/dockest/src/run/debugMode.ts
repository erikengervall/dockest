import { DockestConfig } from '../@types'
import { Logger } from '../_logger'
import { sleep } from '../utils/sleep'

export const debugMode = async ({
  debug,
  mutables: { runners },
}: {
  debug: DockestConfig['debug']
  mutables: DockestConfig['mutables']
}) => {
  if (debug) {
    Logger.info(`Debug mode enabled, containers are kept running and Jest will not run.`)

    Object.values(runners).forEach(runner => Logger.info(`[${runner.serviceName}]: ${runner.containerId}`))

    await sleep(1000 * 60 * 60 * 24)
  }
}
