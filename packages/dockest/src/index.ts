import { BaseError, ConfigurationError } from './Errors'
import { bootstrap } from './run/bootstrap'
import { debugMode } from './run/debugMode'
import { DockestConfig, DockestOpts, DockestService } from './@types'
import { getOpts } from './utils/getOpts'
import { Logger } from './Logger'
import { MINIMUM_JEST_VERSION } from './constants'
import { runJest } from './run/runJest'
import { teardown } from './run/teardown'
import { waitForServices } from './run/waitForServices'

export { execaWrapper as execa } from './utils/execaWrapper'
export { LOG_LEVEL as logLevel } from './constants'
export { sleep } from './utils/sleep'
export { sleepWithLog } from './utils/sleepWithLog'
// export { createContainerIsHealthyHealthcheck } from './utils/createContainerIsHealthyHealthcheck'

export class Dockest {
  private config: DockestConfig

  public constructor(opts: Partial<DockestOpts>) {
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
    })
    await debugMode({ debug, mutables })
    const { success } = await runJest({ jestLib, jestOpts, mutables })
    await teardown({ hostname, runMode, mutables, perfStart })

    success ? process.exit(0) : process.exit(1)
  }
}
