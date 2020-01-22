import { checkConnection } from './checkConnection'
import { checkResponsiveness } from './healthcheck'
import { fixRunnerHostAccessOnLinux } from './fixRunnerHostAccessOnLinux'
import { resolveContainerId } from './resolveContainerId'
import { runRunnerCommands } from './runRunnerCommands'
import { dockerComposeUp } from './dockerComposeUp'
import { DockestConfig, Runner } from '../../@types'
import { joinBridgeNetwork } from '../../utils/network/joinBridgeNetwork'
import { sleepForX } from '../../utils/sleepForX'
import { bridgeNetworkExists } from '../../utils/network/bridgeNetworkExists'
import { createBridgeNetwork } from '../../utils/network/createBridgeNetwork'
import { DOCKEST_HOST_ADDRESS } from '../../constants'

const logPrefix = '[Setup]'

const waitForRunner = async (runner: Runner) => {
  const { serviceName, dependents, isBridgeNetworkMode } = runner

  runner.logger.debug(`${logPrefix} Initiating...`)

  await dockerComposeUp(serviceName)
  await resolveContainerId(runner)

  if (isBridgeNetworkMode) {
    await joinBridgeNetwork(runner.containerId, serviceName)
  }

  if (process.platform === 'linux' && !isBridgeNetworkMode) {
    await fixRunnerHostAccessOnLinux(runner)
  }

  await checkConnection(runner)
  await checkResponsiveness(runner)
  await runRunnerCommands(runner)

  runner.logger.info(`${logPrefix} Success`, { success: true, endingNewLines: 1 })

  for (const dependant of dependents) {
    await waitForRunner(dependant)
  }
}

export const waitForServices = async (config: DockestConfig) => {
  const {
    $: { runners, isInsideDockerContainer, hostname },
    opts: { afterSetupSleep, runInBand },
  } = config
  const setupPromises = []

  for (const runner of Object.values(runners)) {
    if (!!runInBand) {
      await waitForRunner(runner)
    } else {
      setupPromises.push(waitForRunner(runner))
    }
  }

  await Promise.all(setupPromises)

  if (isInsideDockerContainer) {
    if (!(await bridgeNetworkExists())) {
      await createBridgeNetwork()
    }

    await joinBridgeNetwork(hostname, DOCKEST_HOST_ADDRESS)
  }

  if (afterSetupSleep && afterSetupSleep > 0) {
    await sleepForX('After setup sleep', afterSetupSleep)
  }
}
