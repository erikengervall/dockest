import { shellQuote } from './shell-quote';

describe('shellQuote', () => {
  it('should wrap a value in single quotes', () => {
    expect(shellQuote('/path/with space/docker-compose.yml')).toEqual(`'/path/with space/docker-compose.yml'`);
  });

  it('should escape embedded single quotes', () => {
    expect(shellQuote(`it's`)).toEqual(`'it'\\''s'`);
  });
});
