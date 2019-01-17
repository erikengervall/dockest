import Dockest from './index'
import logger from './utils/logger'
import { tearAll } from './utils/teardown'

interface IErrorPayload {
  code?: number
  signal?: any
  error?: Error
  reason?: any
  p?: any
}

const setupExitHandler = async (): Promise<void> => {
  const config = Dockest.config

  const exitHandler = async (errorPayload: IErrorPayload): Promise<void> => {
    if (errorPayload.code === 0) {
      process.exit(0)
    }

    logger.info('Exithandler invoced', errorPayload)

    if (config.dockest && config.dockest.exitHandler && typeof exitHandler === 'function') {
      const err = errorPayload.error || new Error('Failed to extract error')
      config.dockest.exitHandler(err)
    }

    await tearAll()

    logger.info('Exit with payload')

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
