import { DockestConfig, DockestOpts, DockestService } from './@types';
import { MINIMUM_JEST_VERSION } from './constants';
import { BaseError, ConfigurationError } from './errors';
import { Logger } from './logger';
import { bootstrap } from './run/bootstrap';
import { debugMode } from './run/debug-mode';
import { createLogWriter } from './run/log-writer';
import { runJest } from './run/run-jest';
import { setupExitHandler } from './run/setup-exit-handler';
import { teardown } from './run/teardown';
import { waitForServices } from './run/wait-for-services';
import { getOpts } from './utils/get-opts';

export { DockestService } from './@types';
export { LOG_LEVEL as logLevel } from './constants';
export { execaWrapper as execa } from './utils/execa-wrapper';
export { sleep } from './utils/sleep';
export { sleepWithLog } from './utils/sleep-with-log';

export class Dockest {
  private config: DockestConfig;

  public constructor(opts?: Partial<DockestOpts>) {
    this.config = getOpts(opts);

    Logger.logLevel = this.config.logLevel;
    BaseError.DockestConfig = this.config;

    const jestMajorVersion = parseInt(this.config.jestLib.getVersion(), 10);
    if (jestMajorVersion < parseInt(MINIMUM_JEST_VERSION, 10)) {
      throw new ConfigurationError(
        `Outdated Jest version (${this.config.jestLib.getVersion()}). Upgrade to at least ${MINIMUM_JEST_VERSION}`,
      );
    }
  }

  public run = async (dockestServices: DockestService[]) => {
    this.config.perfStart = Date.now();

    const logWriter = createLogWriter({
      mode: this.config.containerLogs.modes,
      serviceNameFilter: this.config.containerLogs.serviceNameFilter,
      logPath: this.config.containerLogs.logPath,
    });

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
    } = this.config;

    const teardownServices = () => teardown({ hostname, runMode, mutables, perfStart, logWriter });

    const handleExit = setupExitHandler({
      dumpErrors,
      exitHandler,
      mutables,
      perfStart,
      teardown: teardownServices,
    });

    let success: boolean;
    try {
      await bootstrap({ composeFile, dockestServices, runMode, mutables });
      await waitForServices({
        composeOpts,
        mutables,
        hostname,
        runMode,
        runInBand,
        skipCheckConnection,
        logWriter,
      });
      await debugMode({ debug, mutables });
      ({ success } = await runJest({ jestLib, jestOpts, mutables }));
    } catch (reason) {
      // Tear down even when the caller catches the rejection, so no containers are left behind
      await handleExit({ trap: 'run', reason });
      return;
    }

    await teardownServices();

    success ? process.exit(0) : process.exit(1);
  };
}
