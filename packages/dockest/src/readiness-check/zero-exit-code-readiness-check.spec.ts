import { Observable, ReplaySubject, from } from 'rxjs';
import { zeroExitCodeReadinessCheck } from './zero-exit-code-readiness-check';
import { createRunner } from '../test-utils';

const toPromise = <T = any>(input: Promise<T> | Observable<T>): Promise<T> => from(input).toPromise();

it('fails when a non "0" die event is emitted', async done => {
  const dockerEventsStream$ = new ReplaySubject();
  const runner = createRunner({ dockerEventStream$: dockerEventsStream$ as any });

  dockerEventsStream$.next({ service: runner.serviceName, action: 'die', attributes: { exitCode: '1' } });

  await toPromise(zeroExitCodeReadinessCheck({ runner }))
    .then(() => {
      done.fail('Should throw.');
    })
    .catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"Container exited with the wrong exit code '1'."`);
      done();
    });
});

it('succeeds when a "0" die event is emitted', async done => {
  const dockerEventsStream$ = new ReplaySubject();
  const runner = createRunner({ dockerEventStream$: dockerEventsStream$ as any });

  dockerEventsStream$.next({ service: runner.serviceName, action: 'die', attributes: { exitCode: '0' } });

  await toPromise(zeroExitCodeReadinessCheck({ runner }))
    .then(() => {
      done();
    })
    .catch(err => {
      done.fail(err);
    });
});

it('fails when a kill event is emitted', async done => {
  const dockerEventsStream$ = new ReplaySubject();
  const runner = createRunner({ dockerEventStream$: dockerEventsStream$ as any });

  dockerEventsStream$.next({ service: runner.serviceName, action: 'kill' });

  await toPromise(zeroExitCodeReadinessCheck({ runner }))
    .then(() => {
      done.fail('Should throw.');
    })
    .catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"Received kill event."`);
      done();
    });
});
