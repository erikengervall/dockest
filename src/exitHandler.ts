import Dockest, { DockestConfig } from './index'
import { GlobalLogger } from './loggers'

interface ErrorPayload {
  code?: number
  signal?: any
  error?: Error
  reason?: any
  p?: any
}

const setupExitHandler = async (config: DockestConfig): Promise<void> => {
  const { runners } = config

  const exitHandler = async (errorPayload: ErrorPayload): Promise<void> => {
    if (Dockest.jestRanWithResult) {
      // Program ran as expected
      return
    }

    GlobalLogger.error('Exithandler invoced', errorPayload)

    if (config.dockest.exitHandler && typeof exitHandler === 'function') {
      const err = errorPayload.error || new Error('Failed to extract error')
      config.dockest.exitHandler(err)
    }

    for (const runnerKey of Object.keys(runners)) {
      await runners[runnerKey].teardown()
    }

    process.exit(errorPayload.code || 1)
  }

  // so the program will not close instantly
  process.stdin.resume()

  // do something when app is closing
  process.on('exit', async code => exitHandler({ code }))

  // catches ctrl+c event
  process.on('SIGINT', async signal => exitHandler({ signal }))

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', async () => exitHandler({}))
  process.on('SIGUSR2', async () => exitHandler({}))

  // catches uncaught exceptions
  process.on('uncaughtException', async error => exitHandler({ error }))

  // catches unhandled promise rejections
  process.on('unhandledRejection', async (reason, p) => exitHandler({ reason, p }))
}

export default setupExitHandler
