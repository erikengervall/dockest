import { assertServiceNotRunning } from './assert-service-not-running';
import { createRunner } from '../../test-utils';
import { execaWrapper } from '../../utils/execa-wrapper';
import { getComposeCommand } from '../../utils/get-compose-command';

jest.mock('../../utils/execa-wrapper');
jest.mock('../../utils/get-compose-command');

const execaMock = execaWrapper as unknown as jest.Mock;

const stdoutFor = (outputs: Record<string, string>) => (command: string) => {
  const match = Object.keys(outputs).find((fragment) => command.includes(fragment));
  return { stdout: match ? outputs[match] : '' };
};

describe('assertServiceNotRunning', () => {
  beforeEach(() => {
    execaMock.mockReset();
    (getComposeCommand as jest.Mock).mockReturnValue('docker compose');
  });

  it('passes when the service has no running container', () => {
    execaMock.mockImplementation(stdoutFor({}));

    expect(() =>
      assertServiceNotRunning({
        runner: createRunner({ serviceName: 'redis' }),

        composeProjectName: 'app',
      }),
    ).not.toThrow();
  });

  it('looks the container up by the Compose project and service labels', () => {
    execaMock.mockImplementation(stdoutFor({}));

    assertServiceNotRunning({ runner: createRunner({ serviceName: 'redis' }), composeProjectName: 'app' });

    expect(execaMock).toHaveBeenCalledWith(
      "docker ps --quiet --filter 'label=com.docker.compose.project=app' --filter 'label=com.docker.compose.service=redis'",
      expect.anything(),
    );
  });

  it('throws right away, naming the service, when its container is already running', () => {
    execaMock.mockImplementation(stdoutFor({ 'docker ps --quiet --filter': '3f1c2a9b7d4e\n' }));

    expect(() =>
      assertServiceNotRunning({
        runner: createRunner({ serviceName: 'redis' }),

        composeProjectName: 'app',
      }),
    ).toThrow(/Service "redis" is already running \(container 3f1c2a9b7d4e\).*docker compose down/);
  });

  describe('without a Compose project name (standalone docker-compose)', () => {
    const fullId = 'a'.repeat(64);
    const otherId = 'b'.repeat(64);

    it('ignores the service containers that are stopped', () => {
      execaMock.mockImplementation(stdoutFor({ "ps --quiet 'redis'": fullId, '--no-trunc': otherId }));

      expect(() =>
        assertServiceNotRunning({
          runner: createRunner({ serviceName: 'redis' }),

          composeProjectName: null,
        }),
      ).not.toThrow();
    });

    it('throws when one of the service containers is running', () => {
      execaMock.mockImplementation(stdoutFor({ '--no-trunc': `${otherId}\n${fullId}`, "ps --quiet 'redis'": fullId }));

      expect(() =>
        assertServiceNotRunning({
          runner: createRunner({ serviceName: 'redis' }),

          composeProjectName: null,
        }),
      ).toThrow(/already running \(container aaaaaaaaaaaa\)/);
    });
  });
});
