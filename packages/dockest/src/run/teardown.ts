import { DockestConfig } from '../@types'
import { Logger } from '../Logger'
import { teardownSingle } from '../utils/teardownSingle'
import { leaveBridgeNetwork } from '../utils/network/leaveBridgeNetwork'
import { removeBridgeNetwork } from '../utils/network/removeBridgeNetwork'

export const teardown = async (config: DockestConfig) => {
  const {
    $: { perfStart, isInsideDockerContainer, hostname, runners },
  } = config

  for (const runner of runners) {
    await teardownSingle(runner)
  }

  if (isInsideDockerContainer) {
    await leaveBridgeNetwork(hostname)
    await removeBridgeNetwork()
  }

  Logger.measurePerformance(perfStart)
}
