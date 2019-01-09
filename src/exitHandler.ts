import exit from 'exit'

import { IResources } from '.'

const setupExitHandler = async (resources: IResources): Promise<void> => {
  const { Config, Logger, Execs } = resources
  const {
    teardown: { tearAll },
  } = Execs

  const exitHandler = async (errorPayload: {
    code?: number,
    signal?: any,
    error?: Error,
    reason?: any,
    p?: any,
  }): Promise<void> => {
    Logger.info('Exithandler invoced', errorPayload)
    const config = Config.getConfig()

    if (config.dockest && config.dockest.exitHandler && typeof exitHandler === 'function') {
      const err = errorPayload.error || new Error('Failed to extract error')
      config.dockest.exitHandler(err)
    }

    await tearAll()

    Logger.info('Exit with payload')

    exit(errorPayload.code || 1)
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
