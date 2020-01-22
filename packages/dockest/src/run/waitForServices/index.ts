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
  const { serviceName, dependents = [], containerId, isBridgeNetworkMode } = runner

  for (const dependant of dependents) {
    // TODO: Fix these typings ASAP
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    await waitForRunner(dependant)
  }

  runner.logger.debug(`${logPrefix} Initiating...`)

  if (isBridgeNetworkMode) {
    await joinBridgeNetwork(containerId, serviceName)
  }

  if (process.platform === 'linux' && !isBridgeNetworkMode) {
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

  await Promise.all(Object.values(runners).map(resolveContainerId))

  for (const runner of Object.values(runners)) {
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
