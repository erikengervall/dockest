import { take, mapTo, filter } from 'rxjs/operators';
import { withNoStop } from './withNoStop';
import { ReadinessCheck } from '../@types';

export const containerIsHealthyReadinessCheck: ReadinessCheck = withNoStop(({ runner }) =>
  runner.dockerEventStream$.pipe(
    filter(ev => ev.action === 'health_status' && ev.attributes.healthStatus === 'healthy'),
    mapTo(undefined),
    take(1),
  ),
);
