import { Observable, ReplaySubject, from } from 'rxjs';
import { zeroExitCodeReadinessCheck } from './zero-exit-code-readiness-check';
import { createRunner } from '../test-utils';

const toPromise = <T = any>(input: Promise<T> | Observable<T>): Promise<T> => from(input).toPromise();

describe('happy', () => {
  it('succeeds when a "0" die event is emitted', async () => {
    const dockerEventsStream$ = new ReplaySubject();
    const runner = createRunner({ dockerEventStream$: dockerEventsStream$ as any });

    dockerEventsStream$.next({ service: runner.serviceName, action: 'die', attributes: { exitCode: '0' } });

    try {
      await toPromise(zeroExitCodeReadinessCheck({ runner }));
    } catch (error) {
      expect(true).toBe("Shouldn't throw.");
    }
  });
});

describe('sad', () => {
  it('fails when a non "0" die event is emitted', async () => {
    const dockerEventsStream$ = new ReplaySubject();
    const runner = createRunner({ dockerEventStream$: dockerEventsStream$ as any });

    dockerEventsStream$.next({ service: runner.serviceName, action: 'die', attributes: { exitCode: '1' } });

    try {
      await toPromise(zeroExitCodeReadinessCheck({ runner }));
      expect(true).toBe('Should throw.');
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[DockestError: Container exited with the wrong exit code '1'.]`);
    }
  });

  it('fails when a kill event is emitted', async () => {
    const dockerEventsStream$ = new ReplaySubject();
    const runner = createRunner({ dockerEventStream$: dockerEventsStream$ as any });

    dockerEventsStream$.next({ service: runner.serviceName, action: 'kill' });

    try {
      await toPromise(zeroExitCodeReadinessCheck({ runner }));
      expect(true).toBe('Should throw.');
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[DockestError: Received kill event.]`);
    }
  });
});
