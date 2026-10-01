import { Dockest } from './index';

const jestLibWithVersion = (version: string) => ({ ...require('jest'), getVersion: () => version });

describe('Dockest jest version check', () => {
  it('should accept Jest versions with more than one major digit', () => {
    expect(() => new Dockest({ jestLib: jestLibWithVersion('29.7.0') })).not.toThrow();
  });

  it('should reject Jest versions below the minimum by number, not by string', () => {
    expect(() => new Dockest({ jestLib: jestLibWithVersion('9.0.0') })).toThrow('Outdated Jest version (9.0.0)');
  });
});
