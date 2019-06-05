import { DockestError } from '../../../errors'
import { runnerLogger } from '../../../loggers'
import { acquireConnection, sleep } from '../../utils'

const checkConnection = async (runnerConfig: any): Promise<void> => {
  const { service, connectionTimeout, host, port } = runnerConfig

  const recurse = async (connectionTimeout: number) => {
    runnerLogger.checkConnection(connectionTimeout, port, host)

    if (connectionTimeout <= 0) {
      throw new DockestError(`${service} connection timed out`)
    }

    try {
      await acquireConnection(port, host)

      runnerLogger.checkConnectionSuccess()
    } catch (error) {
      connectionTimeout--

      await sleep(1000)
      await recurse(connectionTimeout)
    }
  }

  await recurse(connectionTimeout)
}

export default checkConnection
