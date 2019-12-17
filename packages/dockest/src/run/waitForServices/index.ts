import { checkConnection } from './checkConnection'
import { checkResponsiveness } from './healthcheck'
import { fixRunnerHostAccessOnLinux } from './fixRunnerHostAccessOnLinux'
import { resolveContainerId } from './resolveContainerId'
import { runRunnerCommands } from './runRunnerCommands'
import { DockestConfig, Runner } from '../../@types'
import { joinBridgeNetwork } from '../../utils/network/joinBridgeNetwork'
import { sleepForX } from '../../utils/sleepForX'

const logPrefix = '[Setup]'

const waitForRunner = async (runner: Runner) => {
  runner.logger.debug(`${logPrefix} Initiating...`)

  if (runner.isBridgeNetworkMode) {
    await joinBridgeNetwork(runner.containerId, runner.dockestService.serviceName)
  }

  if (process.platform === 'linux' && !runner.isBridgeNetworkMode) {
    await fixRunnerHostAccessOnLinux(runner)
  }

  await checkConnection(runner)
  await checkResponsiveness(runner)
  await runRunnerCommands(runner)

  runner.logger.info(`${logPrefix} Success`, { success: true, endingNewLines: 1 })
}

export const waitForServices = async (config: DockestConfig) => {
  const {
    $: { runners },
    opts: { afterSetupSleep, runInBand },
  } = config
  const setupPromises = []

  await Promise.all(runners.map(resolveContainerId))

  for (const runner of runners) {
    if (!!runInBand) {
      await waitForRunner(runner)
    } else {
      setupPromises.push(waitForRunner(runner))
    }
  }

  await Promise.all(setupPromises)

  if (afterSetupSleep && afterSetupSleep > 0) {
    await sleepForX('After setup sleep', afterSetupSleep)
  }
}
