import { DockestConfig, DockestOpts, DockestService } from './@types'
import { MINIMUM_JEST_VERSION } from './constants'
import { BaseError, ConfigurationError } from './errors'
import { Logger } from './logger'
import { bootstrap } from './run/bootstrap'
import { debugMode } from './run/debugMode'
import { createLogWriter } from './run/log-writer'
import { runJest } from './run/runJest'
import { teardown } from './run/teardown'
import { waitForServices } from './run/waitForServices'
import { getOpts } from './utils/getOpts'

export { DockestService } from './@types'
export { LOG_LEVEL as logLevel } from './constants'
export { execaWrapper as execa } from './utils/execaWrapper'
export { sleep } from './utils/sleep'
export { sleepWithLog } from './utils/sleepWithLog'

export class Dockest {
  private config: DockestConfig

  public constructor(opts?: Partial<DockestOpts>) {
    this.config = getOpts(opts)

    Logger.logLevel = this.config.logLevel
    BaseError.DockestConfig = this.config

    if (this.config.jestLib.getVersion() < MINIMUM_JEST_VERSION) {
      throw new ConfigurationError(
        `Outdated Jest version (${this.config.jestLib.getVersion()}). Upgrade to at least ${MINIMUM_JEST_VERSION}`,
      )
    }
  }

  public run = async (dockestServices: DockestService[]) => {
    this.config.perfStart = Date.now()

    const logWriter = createLogWriter({
      mode: this.config.containerLogs.modes,
      serviceNameFilter: this.config.containerLogs.serviceNameFilter,
      logPath: this.config.containerLogs.logPath,
    })

    const {
      composeFile,
      composeOpts,
      debug,
      dumpErrors,
      exitHandler,
      hostname,
      runMode,
      jestLib,
      jestOpts,
      mutables,
      perfStart,
      runInBand,
      skipCheckConnection,
    } = this.config

    await bootstrap({
      composeFile,
      dockestServices,
      dumpErrors,
      exitHandler,
      runMode,
      mutables,
      perfStart,
    })

    await waitForServices({
      composeOpts,
      mutables,
      hostname,
      runMode,
      runInBand,
      skipCheckConnection,
      logWriter,
    })
    await debugMode({ debug, mutables })
    const { success } = await runJest({ jestLib, jestOpts, mutables })
    await teardown({ hostname, runMode, mutables, perfStart, logWriter })

    success ? process.exit(0) : process.exit(1)
  }
}
