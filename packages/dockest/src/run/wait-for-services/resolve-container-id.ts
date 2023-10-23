import { interval, race } from 'rxjs';
import { first, map, skipWhile, take, tap } from 'rxjs/operators';
import { Runner } from '../../@types';
import { DockestError } from '../../errors';

const LOG_PREFIX = '[Resolve Container Id]';
const DEFAULT_TIMEOUT = 30;

export const resolveContainerId = async ({ runner }: { runner: Runner }) =>
  race(
    runner.dockerEventStream$.pipe(
      first((event) => event.action === 'start'),
      tap(({ id: containerId }) => {
        runner.logger.info(`${LOG_PREFIX} Success (${containerId})`, { success: true });
        runner.containerId = containerId;
      }),
    ),
    interval(1000).pipe(
      tap((i) => {
        runner.logger.info(`Still waiting for start event... Timeout in ${DEFAULT_TIMEOUT - i}s`);
      }),
      skipWhile((i) => i < DEFAULT_TIMEOUT),
      map(() => {
        throw new DockestError('Timed out', { runner });
      }),
    ),
  )
    .pipe(take(1))
    .toPromise();
