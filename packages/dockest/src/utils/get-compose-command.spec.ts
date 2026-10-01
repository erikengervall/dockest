import execa from 'execa'; // eslint-disable-line import/default
import { getComposeCommand, resetComposeCommand } from './get-compose-command';

jest.mock('execa', () => ({ sync: jest.fn() }));
const syncMock = execa.sync as unknown as jest.Mock;

describe('getComposeCommand', () => {
  beforeEach(() => {
    resetComposeCommand();
    syncMock.mockReset();
  });

  it('should prefer the docker compose plugin', () => {
    syncMock.mockReturnValue({ exitCode: 0 });

    expect(getComposeCommand()).toEqual('docker compose');
    expect(syncMock).toHaveBeenCalledWith('docker', ['compose', 'version'], { reject: false });
  });

  it('should fall back to the standalone docker-compose binary', () => {
    syncMock.mockReturnValue({ exitCode: 1 });

    expect(getComposeCommand()).toEqual('docker-compose');
  });

  it('should resolve once per process', () => {
    syncMock.mockReturnValue({ exitCode: 0 });

    getComposeCommand();
    getComposeCommand();

    expect(syncMock).toHaveBeenCalledTimes(1);
  });
});
