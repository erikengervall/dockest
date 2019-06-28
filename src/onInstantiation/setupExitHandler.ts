import Dockest, { DockestConfig } from '../index'
import { globalLogger } from '../loggers'
import { teardownSingle } from '../utils'

export interface ErrorPayload {
  trap: string
  code?: number
  signal?: any
  error?: Error
  reason?: any
  p?: any
}

const setupExitHandler = async (config: DockestConfig): Promise<void> => {
  const {
    $: { perfStart },
    opts: { exitHandler: customExitHandler },
    runners,
  } = config
  let exitInProgress = false

  const exitHandler = async (errorPayload: ErrorPayload): Promise<void> => {
    if (exitInProgress) {
      return
    }
    exitInProgress = true

    if (!!Dockest.config.$.jestRanWithResult) {
      return // Program ran as expected
    }

    globalLogger.exitHandler('Exithandler invoced', errorPayload)

    if (customExitHandler && typeof customExitHandler === 'function') {
      const error = errorPayload || new Error('Failed to extract error')
      customExitHandler(error)
    }

    for (const runner of runners) {
      await teardownSingle(runner)
    }

    globalLogger.perf(perfStart)
    process.exit(errorPayload.code || 1)
  }

  // so the program will not close instantly
  process.stdin.resume()

  // do something when app is closing
  process.on('exit', async code => exitHandler({ trap: 'exit', code }))

  // catches ctrl+c event
  process.on('SIGINT', async signal => exitHandler({ trap: 'SIGINT', signal }))

  // catches "kill pid" (for example: nodemon restart)
  process.on('SIGUSR1', async () => exitHandler({ trap: 'SIGUSR1' }))
  process.on('SIGUSR2', async () => exitHandler({ trap: 'SIGUSR2' }))

  // catches uncaught exceptions
  process.on('uncaughtException', async error => exitHandler({ trap: 'uncaughtException', error }))

  // catches unhandled promise rejections
  process.on('unhandledRejection', async (reason, p) =>
    exitHandler({ trap: 'unhandledRejection', reason, p })
  )
}

export default setupExitHandler
