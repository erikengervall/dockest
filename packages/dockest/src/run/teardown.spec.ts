import { EventEmitter } from 'events';
import { teardown } from './teardown';
import { DockestConfig } from '../@types';
import { createRunner } from '../test-utils';
import { leaveBridgeNetwork } from '../utils/network/leave-bridge-network';
import { removeBridgeNetwork } from '../utils/network/remove-bridge-network';
import { removeProjectNetworks } from '../utils/network/remove-project-networks';
import { teardownSingle } from '../utils/teardown-single';

jest.mock('../utils/teardown-single');
jest.mock('../utils/network/leave-bridge-network');
jest.mock('../utils/network/remove-bridge-network');
jest.mock('../utils/network/remove-project-networks');

const createMutables = (overrides: Partial<DockestConfig['mutables']> = {}): DockestConfig['mutables'] => ({
  jestRanWithResult: false,
  runners: {},
  dockerEventEmitter: Object.assign(new EventEmitter(), { destroy: jest.fn() }),
  runnerLookupMap: new Map(),
  teardownOrder: null,
  composeProjectName: null,
  ...overrides,
});

const logWriter = { register: jest.fn(), destroy: jest.fn(() => Promise.resolve()) };

const runTeardown = (mutables: DockestConfig['mutables'], runMode: DockestConfig['runMode'] = 'host') =>
  teardown({ hostname: 'host', runMode, mutables, perfStart: 0, logWriter });

const tornDownServices = () =>
  (teardownSingle as jest.Mock).mock.calls.map(([{ runner }]) => runner.serviceName as string);

describe('teardown', () => {
  beforeEach(jest.resetAllMocks);

  it('should tear down in teardown order when one was computed', async () => {
    const first = createRunner({ serviceName: 'first' });
    const second = createRunner({ serviceName: 'second' });

    await runTeardown(
      createMutables({
        runnerLookupMap: new Map([
          ['first', first],
          ['second', second],
        ]),
        teardownOrder: ['second', 'first'],
      }),
    );

    expect(tornDownServices()).toEqual(['second', 'first']);
  });

  it('should include dependsOn runners from the lookup map', async () => {
    const dependency = createRunner({ serviceName: 'dependency' });
    const dependent = createRunner({ serviceName: 'dependent', dependsOn: [dependency] });

    await runTeardown(
      createMutables({
        runners: { dependent },
        runnerLookupMap: new Map([
          ['dependent', dependent],
          ['dependency', dependency],
        ]),
      }),
    );

    expect(tornDownServices()).toEqual(['dependent', 'dependency']);
  });

  it('should fall back to the configured runners before the lookup map is filled', async () => {
    await runTeardown(createMutables({ runners: { only: createRunner({ serviceName: 'only' }) } }));

    expect(tornDownServices()).toEqual(['only']);
  });

  it('should remove the Compose project networks', async () => {
    await runTeardown(createMutables({ composeProjectName: 'my-project' }));

    expect(removeProjectNetworks).toHaveBeenCalledWith('my-project');
  });

  it('should keep going when a step fails', async () => {
    (leaveBridgeNetwork as jest.Mock).mockImplementation(() => {
      throw new Error('not connected');
    });
    const mutables = createMutables({ composeProjectName: 'my-project' });

    await runTeardown(mutables, 'docker-injected-host-socket');

    expect(removeBridgeNetwork).toHaveBeenCalled();
    expect(removeProjectNetworks).toHaveBeenCalled();
    expect(mutables.dockerEventEmitter.destroy).toHaveBeenCalled();
    expect(logWriter.destroy).toHaveBeenCalled();
  });

  it('should do the Docker work before the returned promise is awaited', () => {
    void runTeardown(createMutables({ runners: { only: createRunner({ serviceName: 'only' }) } }));

    expect(tornDownServices()).toEqual(['only']);
  });
});
