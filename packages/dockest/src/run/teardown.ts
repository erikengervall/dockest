import { DockestConfig } from '../@types'
import { leaveBridgeNetwork } from '../utils/network/leaveBridgeNetwork'
import { Logger } from '../Logger'
import { removeBridgeNetwork } from '../utils/network/removeBridgeNetwork'
import { teardownSingle } from '../utils/teardownSingle'

export const teardown = async ({
  hostname,
  isInsideDockerContainer,
  mutables: { runners },
  perfStart,
}: {
  hostname: DockestConfig['hostname']
  isInsideDockerContainer: DockestConfig['isInsideDockerContainer']
  mutables: DockestConfig['mutables']
  perfStart: DockestConfig['perfStart']
}) => {
  for (const runner of Object.values(runners)) {
    await teardownSingle({ runner })
  }

  if (isInsideDockerContainer) {
    await leaveBridgeNetwork({ containerId: hostname })
    await removeBridgeNetwork()
  }

  Logger.measurePerformance(perfStart)
}
