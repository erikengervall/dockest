import { getOpts } from './getOpts'

describe('getOpts', () => {
  it('should snapshot default opts', () => {
    expect(getOpts()).toMatchInlineSnapshot(
      {
        mutables: expect.any(Object),
        perfStart: expect.any(Number),
      },
      `
      Object {
        "composeFile": "docker-compose.yml",
        "composeOpts": Object {
          "alwaysRecreateDeps": false,
          "build": false,
          "forceRecreate": false,
          "noBuild": false,
          "noColor": false,
          "noDeps": false,
          "noRecreate": false,
          "quietPull": false,
        },
        "containerLogs": Object {
          "logPath": "./",
          "modes": Array [
            "aggregate",
          ],
          "serviceNameFilter": Array [],
        },
        "debug": false,
        "dumpErrors": false,
        "exitHandler": [Function],
        "hostname": "host.docker.internal",
        "jestLib": Object {
          "SearchSource": [Function],
          "TestScheduler": [Function],
          "TestWatcher": [Function],
          "getVersion": [Function],
          "run": [Function],
          "runCLI": [Function],
        },
        "jestOpts": Object {
          "projects": Array [
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
    )
  })
})
