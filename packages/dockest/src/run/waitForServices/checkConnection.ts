import net from 'net'
import { DockestError } from '../../Errors'
import { Runner } from '../../@types'
import { sleep } from '../../utils/sleep'

const logPrefix = '[Check Connection]'

const acquireConnection = (host: string, port: number) =>
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

export const checkConnection = async (runner: Runner) => {
  const {
    dockerComposeFileService: { ports },
    logger,
    host: runnerHost,
    isBridgeNetworkMode,
  } = runner

  const connectionTimeout = 10
  const host = runnerHost || 'localhost'
  const portKey = isBridgeNetworkMode ? 'target' : 'published'

  for (const { [portKey]: port } of ports) {
    const recurse = async (connectionTimeout: number) => {
      logger.debug(`${logPrefix} Timeout in ${connectionTimeout}s (${host}:${port})`)

      if (connectionTimeout <= 0) {
        throw new DockestError(`${logPrefix} Timed out`, { runner })
      }

      try {
        await acquireConnection(host, port)

        logger.info(`${logPrefix} Success`, { success: true })
      } catch (error) {
        connectionTimeout--

        await sleep(1000)
        await recurse(connectionTimeout)
      }
    }

    await recurse(connectionTimeout)
  }
}
