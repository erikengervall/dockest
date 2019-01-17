import execa from 'execa'
import net from 'net'

import Logger from '../../DockestLogger'
import { IPostgresRunnerConfig } from '../../runners/postgres'

const logger = new Logger()

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
        console.log('*** connected to server!') // tslint:disable-line
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

// Deprecated
const getContainerId = async (runnerConfig: IPostgresRunnerConfig): Promise<string> => {
  const { label } = runnerConfig
  const { stdout } = await execa.shell(
    `docker ps --filter "status=running" --filter "label=${label}" --no-trunc -q`
  )
  const containerId = stdout.replace(/\r?\n|\r/g, '')

  return containerId
}

export { sleep, acquireConnection, getContainerId, runCustomCommand }
