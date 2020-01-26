import { checkConnection } from './checkConnection'
import { checkResponsiveness } from './healthcheck'
import { dockerComposeUp } from './dockerComposeUp'
import { fixRunnerHostAccessOnLinux } from './fixRunnerHostAccessOnLinux'
import { resolveContainerId } from './resolveContainerId'
import { runRunnerCommands } from './runRunnerCommands'
import { createBridgeNetwork } from '../../utils/network/createBridgeNetwork'
import { DOCKEST_HOST_ADDRESS } from '../../constants'
import { DockestConfig, Runner, RunnersObj } from '../../@types'
import { joinBridgeNetwork } from '../../utils/network/joinBridgeNetwork'
import { bridgeNetworkExists } from '../../utils/network/bridgeNetworkExists'

const logPrefix = '[Setup]'

export const waitForServices = async ({
  composeOpts,
  hostname,
  isInsideDockerContainer,
  runInBand,
  runners,
}: {
  composeOpts: DockestConfig['composeOpts']
  hostname: DockestConfig['hostname']
  isInsideDockerContainer: DockestConfig['isInsideDockerContainer']
  runInBand: DockestConfig['runInBand']
  runners: RunnersObj
}) => {
  const setupPromises = []

  const waitForRunner = async (runner: Runner) => {
    const { isBridgeNetworkMode, dependents, serviceName } = runner

    runner.logger.debug(`${logPrefix} Initiating...`)

    await dockerComposeUp(composeOpts, serviceName)
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

  if (isInsideDockerContainer) {
    if (!(await bridgeNetworkExists())) {
      await createBridgeNetwork()
    }

    await joinBridgeNetwork(hostname, DOCKEST_HOST_ADDRESS)
  }

  for (const runner of Object.values(runners)) {
    if (runInBand) {
      await waitForRunner(runner)
    } else {
      setupPromises.push(waitForRunner(runner))
    }
  }

  await Promise.all(setupPromises)
}
