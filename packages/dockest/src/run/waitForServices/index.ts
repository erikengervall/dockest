import { checkConnection } from './checkConnection'
import { runReadinessCheck } from './runReadinessCheck'
import { dockerComposeUp } from './dockerComposeUp'
import { fixRunnerHostAccessOnLinux } from './fixRunnerHostAccessOnLinux'
import { resolveContainerId } from './resolveContainerId'
import { runRunnerCommands } from './runRunnerCommands'
import { createBridgeNetwork } from '../../utils/network/createBridgeNetwork'
import { DOCKEST_HOST_ADDRESS } from '../../constants'
import { DockestConfig, Runner } from '../../@types'
import { joinBridgeNetwork } from '../../utils/network/joinBridgeNetwork'
import { bridgeNetworkExists } from '../../utils/network/bridgeNetworkExists'

const LOG_PREFIX = '[Setup]'

export const waitForServices = async ({
  composeOpts,
  hostname,
  isInsideDockerContainer,
  mutables: { runners },
  runInBand,
  skipCheckConnection,
}: {
  composeOpts: DockestConfig['composeOpts']
  hostname: DockestConfig['hostname']
  isInsideDockerContainer: DockestConfig['isInsideDockerContainer']
  mutables: DockestConfig['mutables']
  runInBand: DockestConfig['runInBand']
  skipCheckConnection: DockestConfig['skipCheckConnection']
}) => {
  const setupPromises = []

  const waitForRunner = async ({
    runner,
    runner: { isBridgeNetworkMode, dependents, serviceName },
  }: {
    runner: Runner
  }) => {
    runner.logger.debug(`${LOG_PREFIX} Initiating...`)

    await dockerComposeUp({ composeOpts, serviceName })
    await resolveContainerId({ runner })

    if (isBridgeNetworkMode) {
      await joinBridgeNetwork({ containerId: runner.containerId, alias: serviceName })
    }

    if (process.platform === 'linux' && !isBridgeNetworkMode) {
      await fixRunnerHostAccessOnLinux(runner)
    }

    if (skipCheckConnection) {
      runner.logger.debug(`${LOG_PREFIX} Skip connection check.`)
    } else {
      await checkConnection({ runner })
    }
    await runReadinessCheck({ runner })
    await runRunnerCommands({ runner })

    runner.logger.info(`${LOG_PREFIX} Success`, { success: true, endingNewLines: 1 })

    for (const dependant of dependents) {
      await waitForRunner({ runner: dependant })
    }
  }

  if (isInsideDockerContainer) {
    if (!(await bridgeNetworkExists())) {
      await createBridgeNetwork()
    }

    await joinBridgeNetwork({ containerId: hostname, alias: DOCKEST_HOST_ADDRESS })
  }

  for (const runner of Object.values(runners)) {
    if (runInBand) {
      await waitForRunner({ runner })
    } else {
      setupPromises.push(waitForRunner({ runner }))
    }
  }

  await Promise.all(setupPromises)
}
