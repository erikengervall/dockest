import { DockestError } from '../../errors'
import { runnerLogger } from '../../loggers'
import { ExecOpts } from '../index'
import { acquireConnection, sleep } from '../utils'

export default async (runnerConfig: any, execOpts: ExecOpts): Promise<void> => {
  const { service, connectionTimeout, host, port } = runnerConfig
  const { runnerKey } = execOpts

  const recurse = async (connectionTimeout: number) => {
    runnerLogger.checkConnection(connectionTimeout)

    if (connectionTimeout <= 0) {
      throw new DockestError(`${service} connection timed out`)
    }

    try {
      await acquireConnection(port, host)

      runnerLogger.checkConnectionSuccess(runnerKey)
    } catch (error) {
      connectionTimeout--

      await sleep(1000)
      await recurse(connectionTimeout)
    }
  }

  await recurse(connectionTimeout)
}
