import fs from 'fs';
import { constants } from 'os';

import { DockestConfig, ErrorPayload } from '../@types';
import { BaseError } from '../errors';
import { Logger } from '../logger';

const LOG_PREFIX = '[Exit Handler]';

const SIGNALS = ['SIGINT', 'SIGTERM', 'SIGUSR1', 'SIGUSR2'] as const;

/** JSON.stringify drops an Error's non-enumerable `name`, `message` and `stack`, serializing it as `{}` */
const serializeErrors = (_key: string, value: unknown) =>
  value instanceof Error ? { ...value, name: value.name, message: value.message, stack: value.stack } : value;

const getExitCode = ({ code, signal }: ErrorPayload): number => {
  if (code) {
    return code;
  }

  const signalNumber = signal ? constants.signals[signal as NodeJS.Signals] : undefined;
  return signalNumber ? 128 + signalNumber : 1;
};

export type ExitHandler = (errorPayload: ErrorPayload) => Promise<void>;

/**
 * Tear down the services and exit when the run fails, is interrupted or crashes.
 */
export const setupExitHandler = ({
  dumpErrors,
  exitHandler: customExitHandler,
  mutables,
  perfStart,
  teardown,
}: {
  dumpErrors: DockestConfig['dumpErrors'];
  exitHandler: DockestConfig['exitHandler'];
  mutables: DockestConfig['mutables'];
  perfStart: DockestConfig['perfStart'];
  /** Tears down synchronously, then resolves once the container logs are flushed */
  teardown: () => Promise<void>;
}): ExitHandler => {
  let exitInProgress = false;

  const exitHandler: ExitHandler = async (errorPayload) => {
    // Ensure the exit handler is only invoked once
    if (exitInProgress) {
      return;
    }
    exitInProgress = true;

    // Jest has finished and the regular teardown owns the exit
    if (mutables.jestRanWithResult) {
      return;
    }

    // `process.on('exit')` listeners run synchronously, so nothing after the first `await` would execute
    const isProcessExiting = errorPayload.trap === 'exit';

    if (errorPayload.reason instanceof BaseError) {
      const {
        payload: { error, runner, ...restPayload },
        message,
        name,
        stack,
      } = errorPayload.reason;

      const logPayload: any = {
        data: {
          name,
          stack,
        },
      };

      runner && (logPayload.data.serviceName = runner.serviceName);
      runner && runner.containerId && (logPayload.data.containerId = runner.containerId);

      error && (logPayload.data.error = error);

      restPayload &&
        typeof restPayload === 'object' &&
        Object.keys(restPayload).length > 0 &&
        (logPayload.data.restPayload = restPayload);

      Logger.error(`${LOG_PREFIX} ${message}`, logPayload);
    } else {
      // The rejected promise serializes as {}, so it is left out
      Logger.error(`${LOG_PREFIX} ${JSON.stringify({ ...errorPayload, promise: undefined }, serializeErrors, 2)}`);
    }

    if (customExitHandler && typeof customExitHandler === 'function') {
      const customExitHandlerResult = customExitHandler(errorPayload);
      if (!isProcessExiting) {
        await customExitHandlerResult;
      }
    }

    const logsFlushed = teardown();

    if (dumpErrors === true) {
      const dumpPath = `${process.cwd()}/dockest-error.json`;
      const dumpPayload = {
        errorPayload,
        timestamp: new Date(),
      };

      try {
        fs.writeFileSync(dumpPath, JSON.stringify(dumpPayload, serializeErrors, 2));
      } catch (dumpError) {
        Logger.debug(`Failed to dump error to ${dumpPath}`, { data: { dumpError, dumpPayload } });
      }
    }

    Logger.measurePerformance(perfStart, { logPrefix: LOG_PREFIX });

    if (isProcessExiting) {
      return;
    }

    await logsFlushed;
    process.exit(getExitCode(errorPayload));
  };

  // keeps the program from closing instantly
  process.stdin.resume(); // FIXME: causes "Jest has detected the following 1 open handle potentially keeping Jest from exiting:"

  // do something when app is closing
  process.on('exit', (code) => exitHandler({ trap: 'exit', code }));

  // catches ctrl+c, "kill pid" and CI cancellation (SIGTERM), and nodemon restarts (SIGUSR1, SIGUSR2)
  for (const signal of SIGNALS) {
    process.on(signal, () => exitHandler({ trap: signal, signal }));
  }

  // catches uncaught exceptions
  process.on('uncaughtException', (error) => exitHandler({ trap: 'uncaughtException', error }));

  // catches unhandled promise rejections
  process.on('unhandledRejection', (reason, promise) => exitHandler({ trap: 'unhandledRejection', reason, promise }));

  return exitHandler;
};
