import { DockestConfig, RunnersObj } from '../@types'
import { Logger } from '../Logger'
import { teardownSingle } from '../utils/teardownSingle'
import { leaveBridgeNetwork } from '../utils/network/leaveBridgeNetwork'
import { removeBridgeNetwork } from '../utils/network/removeBridgeNetwork'

export const teardown = async ({
  hostname,
  isInsideDockerContainer,
  perfStart,
  runners,
}: {
  hostname: DockestConfig['hostname']
  isInsideDockerContainer: DockestConfig['isInsideDockerContainer']
  perfStart: DockestConfig['perfStart']
  runners: RunnersObj
}) => {
  for (const runner of Object.values(runners)) {
    await teardownSingle(runner)
  }

  if (isInsideDockerContainer) {
    await leaveBridgeNetwork(hostname)
    await removeBridgeNetwork()
  }

  Logger.measurePerformance(perfStart)
}
