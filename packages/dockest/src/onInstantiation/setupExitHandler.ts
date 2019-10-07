import { DockestConfig } from '../index'
import { ErrorPayload } from '../@types'
import dumpError from '../utils/dumpError'
import Logger from '../Logger'
import teardownSingle from '../utils/teardownSingle'

export default async (config: DockestConfig): Promise<void> => {
  const {
    $: { perfStart, dockerLogs, dockerComposeUpProcess },
    opts: { exitHandler: customExitHandler },
    runners,
  } = config
  let exitInProgress = false

  const exitHandler = async (errorPayload: ErrorPayload): Promise<void> => {
    if (exitInProgress) {
      return
    }
    exitInProgress = true

    if (config.$.jestRanWithResult) {
      return
    }

    Logger.error(`💥 Exithandler invoked: ${JSON.stringify(errorPayload, null, 2)}`)

    if (customExitHandler && typeof customExitHandler === 'function') {
      const error = errorPayload || new Error('Failed to extract error')
      customExitHandler(error)
    }

    for (const runner of runners) {
      await teardownSingle(runner)
    }

    if (dockerComposeUpProcess) {
      await dockerComposeUpProcess.cancel()
    }

    Logger.error('Docker Container Logs: \n\n' + dockerLogs.join('\n'))

    if (config.opts.dumpErrors === true) {
      dumpError({
        errorPayload,
        timestamp: new Date(),
        __configuration: config,
      })
    }

    Logger.perf(perfStart)
    process.exit(errorPayload.code || 1)
  }

  // so the program will not close instantly
  process.stdin.resume() // FIXME: causes "Jest has detected the following 1 open handle potentially keeping Jest from exiting:"

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
  process.on('unhandledRejection', async (reason, promise) =>
    exitHandler({ trap: 'unhandledRejection', reason, promise }),
  )
}
