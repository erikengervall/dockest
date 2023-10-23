import { from, of } from 'rxjs';
import { delay, mergeMap, retryWhen, takeWhile, tap } from 'rxjs/operators';
import { ReadinessCheck } from '../@types';
import { DockestError } from '../errors';

const LOG_PREFIX = '[Readiness Retry]';

/**
 * Retry a readiness check for the specified amount before failing/succeeding.
 */
export const withRetry =
  (
    input: ReadinessCheck,
    opts: {
      retryCount: number;
    },
  ): ReadinessCheck =>
  (args) => {
    return of(input).pipe(
      mergeMap((readinessCheck) => from(readinessCheck(args))),
      retryWhen((errors) => {
        let retries = 0;

        return errors.pipe(
          tap((value) => {
            retries = retries + 1;
            args.runner.logger.warn(`${LOG_PREFIX} Error: ${value.message}`);
            args.runner.logger.debug(`${LOG_PREFIX} Timeout after ${
              opts.retryCount - retries
            } retries (Retry count set to ${opts.retryCount}).
`);
          }),
          takeWhile(() => {
            if (retries < opts.retryCount) {
              return true;
            }

            throw new DockestError(`${LOG_PREFIX} Timed out`, { runner: args.runner });
          }),
          delay(1000),
        );
      }),
    );
  };
