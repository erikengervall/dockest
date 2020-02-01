import MockDate from 'mockdate'
import { getOpts } from './getOpts'

MockDate.set(new Date('2020-01-01T13:37:00.000Z'))

describe('getOpts', () => {
  it('should snapshot default opts', () => {
    expect(getOpts()).toMatchInlineSnapshot(`
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
        "debug": false,
        "dumpErrors": false,
        "exitHandler": [Function],
        "hostname": "host.docker.internal",
        "isInsideDockerContainer": false,
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
        "mutables": Object {
          "jestRanWithResult": false,
          "runners": Object {},
        },
        "perfStart": 1577885820000,
        "runInBand": true,
      }
    `)
  })
})
