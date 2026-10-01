import { EventEmitter } from 'events';
import { setupExitHandler } from './setup-exit-handler';
import { DockestConfig } from '../@types';
import { DockestError } from '../errors';
import { Logger } from '../logger';

const createMutables = (overrides: Partial<DockestConfig['mutables']> = {}): DockestConfig['mutables'] => ({
  jestRanWithResult: false,
  runners: {},
  dockerEventEmitter: Object.assign(new EventEmitter(), { destroy: jest.fn() }),
  runnerLookupMap: new Map(),
  teardownOrder: null,
  composeProjectName: null,
  ...overrides,
});

describe('setupExitHandler', () => {
  let processOn: jest.SpyInstance;
  let processExit: jest.SpyInstance;
  let loggerError: jest.SpyInstance;
  let teardown: jest.Mock;

  const setup = (opts: { mutables?: DockestConfig['mutables']; exitHandler?: DockestConfig['exitHandler'] } = {}) =>
    setupExitHandler({
      dumpErrors: false,
      exitHandler: opts.exitHandler,
      mutables: opts.mutables ?? createMutables(),
      perfStart: 0,
      teardown,
    });

  beforeEach(() => {
    processOn = jest.spyOn(process, 'on').mockImplementation(() => process);
    jest.spyOn(process.stdin, 'resume').mockImplementation(() => process.stdin);
    processExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    loggerError = jest.spyOn(Logger, 'error').mockImplementation(() => undefined);
    jest.spyOn(Logger, 'info').mockImplementation(() => undefined);
    teardown = jest.fn(() => Promise.resolve());
  });

  afterEach(jest.restoreAllMocks);

  it('should tear down and exit with 1 when the run fails', async () => {
    await setup()({ trap: 'run', reason: new DockestError('Timed out') });

    expect(teardown).toHaveBeenCalledTimes(1);
    expect(processExit).toHaveBeenCalledWith(1);
  });

  it('should only run once', async () => {
    const exitHandler = setup();

    await exitHandler({ trap: 'run', reason: new DockestError('first') });
    await exitHandler({ trap: 'SIGINT', signal: 'SIGINT' });

    expect(teardown).toHaveBeenCalledTimes(1);
  });

  it('should leave the exit to the regular teardown once Jest has run', async () => {
    await setup({ mutables: createMutables({ jestRanWithResult: true }) })({ trap: 'SIGINT', signal: 'SIGINT' });

    expect(teardown).not.toHaveBeenCalled();
    expect(processExit).not.toHaveBeenCalled();
  });

  it('should listen for SIGTERM and exit with the conventional signal exit code', async () => {
    const exitHandler = setup();

    expect(processOn).toHaveBeenCalledWith('SIGTERM', expect.any(Function));

    await exitHandler({ trap: 'SIGTERM', signal: 'SIGTERM' });

    expect(processExit).toHaveBeenCalledWith(143);
  });

  it('should tear down synchronously when the process is already exiting', () => {
    const customExitHandler = jest.fn(() => new Promise(() => undefined));

    void setup({ exitHandler: customExitHandler })({ trap: 'exit', code: 0 });

    expect(customExitHandler).toHaveBeenCalled();
    expect(teardown).toHaveBeenCalledTimes(1);
    expect(processExit).not.toHaveBeenCalled();
  });

  it('should await the custom exit handler before tearing down', async () => {
    const order: string[] = [];
    teardown.mockImplementation(() => {
      order.push('teardown');
      return Promise.resolve();
    });

    await setup({
      exitHandler: async () => {
        order.push('custom');
      },
    })({ trap: 'run', reason: new DockestError('failed') });

    expect(order).toEqual(['custom', 'teardown']);
  });

  it('should still tear down when the custom exit handler throws', async () => {
    await setup({
      exitHandler: async () => {
        throw new Error('handler bug');
      },
    })({ trap: 'run', reason: new DockestError('failed') });

    expect(teardown).toHaveBeenCalledTimes(1);
    expect(processExit).toHaveBeenCalledWith(1);
  });

  it('should log the message of a plain error instead of {}', async () => {
    await setup()({ trap: 'uncaughtException', error: new Error('kaboom') });

    expect(loggerError.mock.calls[0][0]).toContain('"message": "kaboom"');
  });
});
