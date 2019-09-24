import net from 'net'
import { Runner } from '../../runners/@types'
import DockestError from '../../errors/DockestError'
import sleep from '../../utils/sleep'

const acquireConnection = (host: string, port: number): Promise<void> =>
  new Promise((resolve, reject) => {
    let connected = false
    let timeoutId: NodeJS.Timeout | null = null

    const netSocket = net
      .createConnection({ host, port })
      .on('connect', () => {
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        connected = true
        netSocket.end()
        resolve()
      })
      .on('error', () => {
        connected = false
      })

    timeoutId = setTimeout(() => !connected && reject(new Error('Timeout while acquiring connection')), 1000)
  })

const testables = { acquireConnection }
export { testables }

export default async (runner: Runner) => {
  const {
    runnerConfig: { service, connectionTimeout, ports },
    logger,
  } = runner

  const host =
    typeof runner.runnerConfig.host === 'function'
      ? runner.runnerConfig.host(runner.containerId)
      : runner.runnerConfig.host

  for (const { published: port } of ports) {
    const recurse = async (connectionTimeout: number) => {
      logger.debug(`Checking connection (${host}:${port}) (Timeout in: ${connectionTimeout}s)`)

      if (connectionTimeout <= 0) {
        throw new DockestError(`${service} connection timed out`)
      }

      try {
        await acquireConnection(host, port)

        logger.debug(`Checked connection successfully`)
      } catch (error) {
        connectionTimeout--

        await sleep(1000)
        await recurse(connectionTimeout)
      }
    }

    await recurse(connectionTimeout)
  }
}
