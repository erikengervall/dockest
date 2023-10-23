import { filter, mapTo, take } from 'rxjs/operators';
import { withNoStop } from './with-no-stop';
import { ReadinessCheck } from '../@types';

export const containerIsHealthyReadinessCheck: ReadinessCheck = withNoStop(({ runner }) =>
  runner.dockerEventStream$.pipe(
    filter((event) => event.action === 'health_status' && event.attributes.healthStatus === 'healthy'),
    mapTo(undefined),
    take(1),
  ),
);
