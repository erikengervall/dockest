import { default as jestLib } from 'jest'
import isDocker from 'is-docker' // eslint-disable-line import/default
import { BaseError, ConfigurationError } from './Errors'
import { bootstrap } from './run/bootstrap'
import { debugMode } from './run/debugMode'
import { DEFAULT_OPTS, DEFAULT_$, MINIMUM_JEST_VERSION } from './constants'
import { DockestConfig, DockestService } from './@types'
import { Logger } from './Logger'
import { runJest } from './run/runJest'
import { startServices } from './run/startServices'
import { teardown } from './run/teardown'
import { waitForServices } from './run/waitForServices'

export { defaultHealthchecks } from './utils/defaultHealthchecks'
export { execaWrapper as execa } from './utils/execaWrapper'
export { LOG_LEVEL as logLevel } from './constants'

export class Dockest {
  private config: DockestConfig

  public constructor(opts: Partial<DockestConfig['opts']>) {
    this.config = {
      $: {
        ...DEFAULT_$,
      },
      opts: {
        ...DEFAULT_OPTS,
        jestLib,
        ...opts,
      },
    }

    Logger.logLevel = this.config.opts.logLevel
    BaseError.DockestConfig = this.config

    if (this.config.opts.jestLib.getVersion() < MINIMUM_JEST_VERSION) {
      throw new ConfigurationError(
        `Outdated Jest version (${this.config.opts.jestLib.getVersion()}). Upgrade to at least ${MINIMUM_JEST_VERSION}`,
      )
    }
  }

  public run = async (dockestServices: DockestService[]) => {
    this.config.$.perfStart = Date.now()
    this.config.$.isInsideDockerContainer = isDocker()
    this.config.$.dockestServices = dockestServices

    await bootstrap(this.config)
    await startServices(this.config)
    await waitForServices(this.config)
    await debugMode(this.config)
    const { success } = await runJest(this.config)
    await teardown(this.config)
    success ? process.exit(0) : process.exit(1)
  }
}
