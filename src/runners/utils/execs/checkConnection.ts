import { DockestError } from '../../../errors'
import { runnerLogger } from '../../../loggers'
import { Runners } from '../../index'
import { acquireConnection, sleep } from '../../utils'

const checkConnection = async (runner: Runners): Promise<void> => {
  const {
    runnerConfig: { service, connectionTimeout, host, port },
  } = runner

  const recurse = async (connectionTimeout: number) => {
    runnerLogger.checkConnection(connectionTimeout, host, port)

    if (connectionTimeout <= 0) {
      throw new DockestError(`${service} connection timed out`)
    }

    try {
      await acquireConnection(host, port)

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
