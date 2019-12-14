import { DockestConfig } from '../@types'
import { Logger } from '../Logger'
import { sleep } from '../utils/sleep'

export const waitForeverIfDev = async (config: DockestConfig) => {
  const {
    opts: { debug },
    $: { runners },
  } = config

  if (debug || process.argv.includes('dev') || process.argv.includes('debug')) {
    Logger.info(`Debug mode enabled, containers are kept running and Jest will not run.`)

    runners.forEach(runner => Logger.info(`[${runner.dockestService.serviceName}]: ${runner.containerId}`))

    await sleep(1000 * 60 * 60 * 24)
  }
}
