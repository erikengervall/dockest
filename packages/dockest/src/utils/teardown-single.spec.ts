import { execaWrapper } from './execa-wrapper';
import { teardownSingle } from './teardown-single';
import { createRunner } from '../test-utils';

jest.mock('./execa-wrapper');
jest.mock('./get-compose-command', () => ({ getComposeCommand: () => 'docker compose' }));

const execaWrapperMock = execaWrapper as unknown as jest.Mock;
const commands = () => execaWrapperMock.mock.calls.map(([command]) => command as string);

describe('teardownSingle', () => {
  beforeEach(() => {
    execaWrapperMock.mockReset();
    execaWrapperMock.mockReturnValue({ exitCode: 0, stdout: '' });
  });

  it('should stop and remove the known container', () => {
    teardownSingle({ runner: createRunner({ containerId: 'abc' }) });

    expect(commands()).toEqual(['docker stop abc', 'docker rm abc --volumes']);
  });

  it('should leave services alone that Dockest never started', () => {
    teardownSingle({ runner: createRunner({ containerId: '' }) });

    expect(execaWrapperMock).not.toHaveBeenCalled();
  });

  it('should find the container of a started service whose start event was missed', () => {
    execaWrapperMock.mockReturnValueOnce({ exitCode: 0, stdout: 'def\n' });

    teardownSingle({ runner: createRunner({ containerId: '', isStartRequested: true }) });

    expect(commands()[0]).toContain('ps --all --quiet node');
    expect(commands().slice(1)).toEqual(['docker stop def', 'docker rm def --volumes']);
  });

  it('should not trust the output of a failed container lookup', () => {
    execaWrapperMock.mockReturnValueOnce({ exitCode: 1, stdout: 'unknown flag: --all' });

    teardownSingle({ runner: createRunner({ containerId: '', isStartRequested: true }) });

    expect(commands()).toHaveLength(1);
  });

  it('should log instead of throwing when removal fails', () => {
    execaWrapperMock.mockImplementation(() => {
      throw new Error('No such container');
    });
    const runner = createRunner({ containerId: 'abc' });
    const warn = jest.spyOn(runner.logger, 'warn').mockImplementation(() => undefined);

    expect(() => teardownSingle({ runner })).not.toThrow();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('No such container'));
  });
});
