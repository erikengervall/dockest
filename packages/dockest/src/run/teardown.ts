import { LogWriter } from './log-writer'
import { DockestConfig } from '../@types'
import { leaveBridgeNetwork } from '../utils/network/leaveBridgeNetwork'
import { Logger } from '../Logger'
import { removeBridgeNetwork } from '../utils/network/removeBridgeNetwork'
import { teardownSingle } from '../utils/teardownSingle'
import { DockestError } from '../Errors'

export const teardown = async ({
  hostname,
  runMode,
  mutables: { runnerLookupMap, dockerEventEmitter, teardownOrder },
  perfStart,
  logWriter,
}: {
  hostname: DockestConfig['hostname']
  runMode: DockestConfig['runMode']
  mutables: DockestConfig['mutables']
  perfStart: DockestConfig['perfStart']
  logWriter: LogWriter
}) => {
  if (teardownOrder) {
    for (const serviceName of teardownOrder) {
      const runner = runnerLookupMap.get(serviceName)
      if (!runner) {
        throw new DockestError('Could not find service in lookup map.')
      }
      await teardownSingle({ runner })
    }
  } else {
    for (const runner of runnerLookupMap.values()) {
      await teardownSingle({ runner })
    }
  }

  if (runMode === 'docker-injected-host-socket') {
    await leaveBridgeNetwork({ containerId: hostname })
    await removeBridgeNetwork()
  }

  dockerEventEmitter.destroy()
  await logWriter.destroy()

  Logger.measurePerformance(perfStart)
}
