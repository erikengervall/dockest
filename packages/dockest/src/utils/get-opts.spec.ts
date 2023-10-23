import { getOpts } from './get-opts';

describe('getOpts', () => {
  it('should snapshot default opts', () => {
    expect(getOpts()).toMatchInlineSnapshot(
      {
        mutables: expect.any(Object),
        perfStart: expect.any(Number),
      },
      `
      {
        "composeFile": "docker-compose.yml",
        "composeOpts": {
          "alwaysRecreateDeps": false,
          "build": false,
          "forceRecreate": false,
          "noBuild": false,
          "noColor": false,
          "noDeps": false,
          "noRecreate": false,
          "quietPull": false,
        },
        "containerLogs": {
          "logPath": "./",
          "modes": [
            "aggregate",
          ],
          "serviceNameFilter": undefined,
        },
        "debug": false,
        "dumpErrors": false,
        "exitHandler": [Function],
        "hostname": "host.docker.internal",
        "jestLib": {
          "SearchSource": [Function],
          "createTestScheduler": [Function],
          "getVersion": [Function],
          "run": [Function],
          "runCLI": [Function],
        },
        "jestOpts": {
          "projects": [
            ".",
          ],
          "runInBand": true,
        },
        "logLevel": 3,
        "mutables": Any<Object>,
        "perfStart": Any<Number>,
        "runInBand": true,
        "runMode": "host",
        "skipCheckConnection": false,
      }
    `,
    );
  });
});
