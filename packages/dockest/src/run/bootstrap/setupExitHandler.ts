import fs from 'fs'
import { BaseError } from '../../Errors'
import { DockestConfig } from '../../@types'
import { Logger } from '../../Logger'
import { teardownSingle } from '../../utils/teardownSingle'

export interface ErrorPayload {
  trap: string
  code?: number
  error?: Error
  promise?: Promise<any>
  reason?: Error | any
  signal?: any
}

const logPrefix = '[Exit Handler]'

export const setupExitHandler = async (config: DockestConfig) => {
  const {
    $: { perfStart, runners },
    opts: { exitHandler: customExitHandler },
  } = config
  let exitInProgress = false

  const exitHandler = async (errorPayload: ErrorPayload) => {
    if (exitInProgress) {
      return
    }

    // Ensure the exit handler is only invoced once
    exitInProgress = true

    if (config.$.jestRanWithResult) {
      return
    }
    if (errorPayload.reason instanceof BaseError) {
      const {
        payload: { error, runner, ...restPayload },
        message,
        name,
        stack,
      } = errorPayload.reason

      const logPayload: any = {
        data: {
          name,
          stack,
        },
      }

      runner && (logPayload.data.serviceName = runner.dockestService.serviceName)
      runner && runner.containerId && (logPayload.data.containerId = runner.containerId)

      error && (logPayload.data.error = error)

      restPayload &&
        typeof restPayload === 'object' &&
        Object.keys(restPayload).length > 0 &&
        (logPayload.data.restPayload = restPayload)

      Logger.error(`${logPrefix} ${message}`, logPayload)
    } else {
      Logger.error(`${logPrefix} ${JSON.stringify(errorPayload, null, 2)}`)
    }

    if (customExitHandler && typeof customExitHandler === 'function') {
      await customExitHandler(errorPayload)
    }

    for (const runner of Object.values(runners)) {
      await teardownSingle(runner)
    }

    if (config.opts.dumpErrors === true) {
      const dumpPath = `${process.cwd()}/dockest-error.json`
      const dumpPayload = {
        errorPayload,
        timestamp: new Date(),
        __configuration: config,
      }

      try {
        fs.writeFileSync(dumpPath, JSON.stringify(dumpPayload, null, 2))
      } catch (dumpError) {
        Logger.debug(`Failed to dump error to ${dumpPath}`, { data: { dumpError, dumpPayload } })
      }
    }

    Logger.measurePerformance(perfStart, { logPrefix })
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
