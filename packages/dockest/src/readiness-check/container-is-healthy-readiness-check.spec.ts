import { Observable, ReplaySubject, from } from 'rxjs';
import { containerIsHealthyReadinessCheck } from './container-is-healthy-readiness-check';
import { createRunner } from '../test-utils';

const toPromise = <T = any>(input: Promise<T> | Observable<T>): Promise<T> => from(input).toPromise();

describe('containerIsHealthyReadinessCheck', () => {
  it('fails when the die event is emitted', done => {
    const dockerEventsStream$ = new ReplaySubject();
    const runner = createRunner({ dockerEventStream$: dockerEventsStream$ as any });

    dockerEventsStream$.next({ service: runner.serviceName, action: 'kill' });

    toPromise(containerIsHealthyReadinessCheck({ runner }))
      .then(() => {
        done.fail('Should throw.');
      })
      .catch(err => {
        expect(err.message).toEqual('Container unexpectedly died.');
        done();
      });
  });

  it('fails when the kill event is emitted', done => {
    const dockerEventsStream$ = new ReplaySubject();
    const runner = createRunner({ dockerEventStream$: dockerEventsStream$ as any });
    dockerEventsStream$.next({ service: runner.serviceName, action: 'die' });

    toPromise(containerIsHealthyReadinessCheck({ runner }))
      .then(() => {
        done.fail('Should throw.');
      })
      .catch(err => {
        expect(err.message).toEqual('Container unexpectedly died.');
        done();
      });
  });

  it('succeeds when the health_status event is emitted', async () => {
    const dockerEventStream$ = new ReplaySubject();
    const runner = createRunner({ dockerEventStream$: dockerEventStream$ as any });
    dockerEventStream$.next({
      service: runner.serviceName,
      action: 'health_status',
      attributes: { healthStatus: 'healthy' },
    });
    const result = await toPromise(containerIsHealthyReadinessCheck({ runner }));
    expect(result).toEqual(undefined);
  });

  it('does not resolve in case a unhealthy event is emitted', done => {
    const dockerEventStream$ = new ReplaySubject();
    const runner = createRunner({ dockerEventStream$: dockerEventStream$ as any });

    let healthCheckDidResolve = false;

    toPromise(containerIsHealthyReadinessCheck({ runner }))
      .then(result => {
        expect(result).toEqual(undefined);
        healthCheckDidResolve = true;
      })
      .catch(err => {
        done.fail(err);
      });

    dockerEventStream$.next({
      service: runner.serviceName,
      action: 'health_status',
      attributes: { healthStatus: 'unhealthy' },
    });

    runner.dockerEventStream$.subscribe(event => {
      if (event.action === 'health_status') {
        if (event.attributes.healthStatus === 'unhealthy') {
          expect(healthCheckDidResolve).toEqual(false);
          dockerEventStream$.next({
            service: runner.serviceName,
            action: 'health_status',
            attributes: { healthStatus: 'healthy' },
          });
        } else if (event.attributes.healthStatus === 'healthy') {
          // defer so this check is run after the healthcheck promise did resolve
          Promise.resolve().then(() => {
            expect(healthCheckDidResolve).toEqual(true);
            done();
          });
        }
      } else {
        done.fail('Unexpected Event was emitted');
      }
    });
  });
});
