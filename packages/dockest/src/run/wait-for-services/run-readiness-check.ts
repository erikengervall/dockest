import { from, of } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { Runner } from '../../@types';

const LOG_PREFIX = '[Run ReadinessCheck]';

export const runReadinessCheck = async ({ runner }: { runner: Runner }) => {
  return of(runner.readinessCheck)
    .pipe(
      tap(() => runner.logger.debug(`${LOG_PREFIX} Starting`)),
      mergeMap((readinessCheck) =>
        from(
          readinessCheck({
            runner,
          }),
        ),
      ),
      tap(() => {
        runner.logger.info(`${LOG_PREFIX} Success`, { success: true });
      }),
    )
    .toPromise();
};
