import { from, race } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ReadinessCheck } from '../@types';
import { DockestError } from '../errors';
import { isDieEvent, isKillEvent } from '../run/bootstrap/create-docker-event-emitter';

/**
 * The wrapped readiness check will fail if the container dies or gets killed.
 */
export const withNoStop = (input: ReadinessCheck): ReadinessCheck => args =>
  race(
    from(input(args)),
    args.runner.dockerEventStream$.pipe(
      filter(event => isDieEvent(event) || isKillEvent(event)),
      map(event => {
        throw new DockestError('Container unexpectedly died.', { runner: args.runner, event });
      }),
    ),
  );
