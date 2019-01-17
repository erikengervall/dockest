import execa from 'execa'
import net from 'net'

import logger from './logger'

const sleep = (ms: number = 1000): Promise<number> =>
  new Promise(resolve => setTimeout(resolve, ms))

const acquireConnection = (host: string = 'localhost', port: number): Promise<void> =>
  new Promise((resolve, reject) => {
    let connected: boolean = false
    let timeoutId: any = null

    const netSocket = net
      .createConnection({ host, port })
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

const runCustomCommand = async (command: string): Promise<void> => {
  logger.loading(`Running custom command: ${command}`)

  const { stdout: result = '' } = await execa.shell(command)

  logger.success(
    `Successfully ran custom command: ${
      typeof result === 'object' ? JSON.stringify(result) : result
    }`
  )
}

export { sleep, acquireConnection, runCustomCommand }
