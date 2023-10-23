import { runReadinessCheck } from './run-readiness-check';
import { createRunner } from '../../test-utils';

it('fails in case the readiness rejects', async done => {
  const runner = createRunner({ readinessCheck: () => Promise.reject(new Error('ReadinessCheck failed.')) });

  return runReadinessCheck({ runner })
    .then(() => done.fail('Should have thrown an error.'))
    .catch(err => {
      expect(err.message).toMatchInlineSnapshot(`"ReadinessCheck failed."`);
      done();
    });
});

it('succeeds in case the readinessCheck succeeds', async () => {
  const runner = createRunner({ readinessCheck: () => Promise.resolve() });
  const result = await runReadinessCheck({ runner });
  expect(result).toEqual(undefined);
});
