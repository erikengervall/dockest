import { runReadinessCheck } from './run-readiness-check';
import { DockestError } from '../../errors';
import { createRunner } from '../../test-utils';

describe('happy', () => {
  it('succeeds in case the readinessCheck succeeds', async () => {
    const runner = createRunner({ readinessCheck: () => Promise.resolve() });
    const result = await runReadinessCheck({ runner });
    expect(result).toEqual(undefined);
  });
});

describe('sad', () => {
  it('fails in case the readiness rejects', async () => {
    const runner = createRunner({ readinessCheck: () => Promise.reject(new DockestError('ReadinessCheck failed.')) });

    try {
      await runReadinessCheck({ runner });
      expect(true).toBe('Should throw.');
    } catch (error) {
      expect(error).toMatchInlineSnapshot(`[DockestError: ReadinessCheck failed.]`);
    }
  });
});
