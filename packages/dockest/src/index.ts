import { BaseError, ConfigurationError } from './Errors'
import { bootstrap } from './run/bootstrap'
import { debugMode } from './run/debugMode'
import { DockestConfig, DockestOpts, DockestService, GlobConfig } from './@types'
import { getOpts } from './utils/getOpts'
import { Logger } from './Logger'
import { MINIMUM_JEST_VERSION } from './constants'
import { runJest } from './run/runJest'
import { teardown } from './run/teardown'
import { waitForServices } from './run/waitForServices'

export { execaWrapper as execa } from './utils/execaWrapper'
export { sleep } from './utils/sleep'
export { sleepWithLog } from './utils/sleepWithLog'
export { LOG_LEVEL as logLevel } from './constants'

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
      isInsideDockerContainer,
      jestLib,
      jestOpts,
      jestRanWithResult,
      perfStart,
      runInBand,
    } = this.config

    const glob: GlobConfig = {
      jestRanWithResult,
      runners: {},
    }

    const runners = await bootstrap({
      composeFile,
      dockestServices,
      dumpErrors,
      exitHandler,
      glob,
      isInsideDockerContainer,
      perfStart,
    })

    await waitForServices({
      composeOpts,
      hostname,
      isInsideDockerContainer,
      runInBand,
      runners,
    })

    await debugMode(debug, runners)

    const { success } = await runJest({
      glob,
      jestLib,
      jestOpts,
    })

    await teardown({
      hostname,
      isInsideDockerContainer,
      perfStart,
      runners,
    })

    success ? process.exit(0) : process.exit(1)
  }
}
