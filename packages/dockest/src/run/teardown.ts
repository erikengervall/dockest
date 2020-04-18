import { DockestConfig } from '../@types'
import { leaveBridgeNetwork } from '../utils/network/leaveBridgeNetwork'
import { Logger } from '../Logger'
import { removeBridgeNetwork } from '../utils/network/removeBridgeNetwork'
import { teardownSingle } from '../utils/teardownSingle'

export const teardown = async ({
  hostname,
  runMode,
  mutables: { runners, dockerEventEmitter },
  perfStart,
}: {
  hostname: DockestConfig['hostname']
  runMode: DockestConfig['runMode']
  mutables: DockestConfig['mutables']
  perfStart: DockestConfig['perfStart']
}) => {
  for (const runner of Object.values(runners)) {
    await teardownSingle({ runner })
  }

  if (runMode === 'docker-injected-host-socket') {
    await leaveBridgeNetwork({ containerId: hostname })
    await removeBridgeNetwork()
  }

  dockerEventEmitter.destroy()

  Logger.measurePerformance(perfStart)
}
