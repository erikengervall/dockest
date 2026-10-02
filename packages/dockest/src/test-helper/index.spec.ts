import { DockerComposeFile } from '../@types';
import { DOCKEST_ATTACH_TO_PROCESS } from '../constants';

const config: DockerComposeFile = {
  services: {
    worker: {
      image: 'node:18-alpine',
      environment: { QUEUE_NAME: 'jobs', CONCURRENCY: 4, FROM_HOST: null },
    },
    redis: { image: 'redis:7' },
  },
};

// The helper reads the attached config when it is imported
const loadTestHelper = (): typeof import('.') => {
  process.env[DOCKEST_ATTACH_TO_PROCESS] = JSON.stringify(config);
  let testHelper: typeof import('.') | undefined;
  jest.isolateModules(() => {
    testHelper = require('.');
  });
  return testHelper as typeof import('.');
};

describe('getServiceEnvironmentVariable', () => {
  afterAll(() => {
    delete process.env[DOCKEST_ATTACH_TO_PROCESS];
  });

  it('returns the value set in the Compose file, as a string', () => {
    const { getServiceEnvironmentVariable } = loadTestHelper();

    expect(getServiceEnvironmentVariable('worker', 'QUEUE_NAME')).toEqual('jobs');
    expect(getServiceEnvironmentVariable('worker', 'CONCURRENCY')).toEqual('4');
  });

  it('throws for a variable that is missing or declared without a value', () => {
    const { getServiceEnvironmentVariable } = loadTestHelper();

    expect(() => getServiceEnvironmentVariable('worker', 'MISSING')).toThrow(
      'Service "worker" has no value for environment variable "MISSING"',
    );
    expect(() => getServiceEnvironmentVariable('worker', 'FROM_HOST')).toThrow(/FROM_HOST/);
    expect(() => getServiceEnvironmentVariable('redis', 'QUEUE_NAME')).toThrow(/QUEUE_NAME/);
  });

  it('throws for an unknown service', () => {
    const { getServiceEnvironmentVariable } = loadTestHelper();

    expect(() => getServiceEnvironmentVariable('postgres', 'QUEUE_NAME')).toThrow('Service "postgres" does not exist');
  });
});
