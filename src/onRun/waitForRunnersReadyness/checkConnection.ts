import net from 'net'
import { DockestError } from '../../errors'
import { Runner } from '../../runners/@types'
import { sleep } from '../../utils/index'

const checkConnection = async (runner: Runner) => {
  const {
    runnerConfig: { service, connectionTimeout, host, ports },
    runnerLogger,
  } = runner
  // TODO: Would it make sense to check connection for every port?
  const port = Object.keys(ports)[0]

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

const acquireConnection = (host: string, port: string): Promise<void> =>
  new Promise((resolve, reject) => {
    let connected: boolean = false
    let timeoutId: any = null

    const netSocket = net
      .createConnection({ host, port: Number(port) })
      .on('connect', () => {
        clearTimeout(timeoutId)
        connected = true
        netSocket.end()
        resolve()
      })
      .on('error', () => {
        connected = false
      })

    timeoutId = setTimeout(
      () => !connected && reject(new Error('Timeout while acquiring connection')),
      1000
    )
  })

const testables = { acquireConnection }
export { testables }
export default checkConnection
