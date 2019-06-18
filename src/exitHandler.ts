import Dockest, { DockestConfig } from './index'
import { globalLogger } from './loggers'
import { teardownSingle } from './utils'

export interface ErrorPayload {
  type: string
  code?: number
  signal?: any
  error?: Error
  reason?: any
  p?: any
}

let exitInProgress = false
const setupExitHandler = async (config: DockestConfig): Promise<void> => {
  const { runners } = config

  const exitHandler = async (errorPayload: ErrorPayload): Promise<void> => {
    if (exitInProgress) {
      return
    }

    exitInProgress = true
    if (Dockest.jestRanWithResult) {
      // Program ran as expected
      return
    }

    globalLogger.error('Exithandler invoced', errorPayload)

    if (config.exitHandler && typeof exitHandler === 'function') {
      const error = errorPayload || new Error('Failed to extract error')
      config.exitHandler(error)
    }

    for (const runner of runners) {
      await teardownSingle(runner)
    }

    process.exit(errorPayload.code || 1)
  }

  // so the program will not close instantly
  process.stdin.resume()

  // do something when app is closing
  process.on('exit', async code => exitHandler({ type: 'exit', code }))

  // catches ctrl+c event
  process.on('SIGINT', async signal => exitHandler({ type: 'SIGINT', signal }))

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', async () => exitHandler({ type: 'SIGUSR1' }))
  process.on('SIGUSR2', async () => exitHandler({ type: 'SIGUSR2' }))

  // catches uncaught exceptions
  process.on('uncaughtException', async error => exitHandler({ type: 'uncaughtException', error }))

  // catches unhandled promise rejections
  process.on('unhandledRejection', async (reason, p) =>
    exitHandler({ type: 'unhandledRejection', reason, p })
  )
}

export default setupExitHandler
