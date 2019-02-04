import execa from 'execa'
import net from 'net'

import logger from './logger'

const sleep = (ms: number = 1000): Promise<number> =>
  new Promise(resolve => setTimeout(resolve, ms))

const acquireConnection = (port: number, host: string = 'localhost'): Promise<void> =>
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

const getContainerId = async (serviceName: string): Promise<string> => {
  const cmd = `docker ps \
                --quiet \
                --filter \
                "name=${serviceName}" \
                --latest`
  logger.shellCmd(cmd)
  const { stdout: containerId } = await execa.shell(cmd)

  return containerId
}

const runCustomCommand = async (command: string): Promise<void> => {
  logger.loading(`Running command`, command)

  const { stdout: result } = await execa.shell(command)

  logger.success(`Command successful`, result)
}

export { sleep, acquireConnection, getContainerId, runCustomCommand }
