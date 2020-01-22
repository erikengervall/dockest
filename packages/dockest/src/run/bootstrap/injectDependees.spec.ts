import { injectDependees } from './injectDependees'
import { Logger } from '../../Logger'
import { RunnersObj } from '../../@types'

describe('injectDependees', () => {
  it('should work', () => {
    const runners: RunnersObj = {
      node: {
        containerId: '',
        dependees: [],
        dockerComposeFileService: { image: 'node:10-alpine', ports: [{ published: 3000, target: 3000 }] },
        dockestService: { serviceName: 'node' },
        logger: new Logger('node'),
      },
    }
    const runnersWithDependsOn: RunnersObj = {
      postgres: {
        containerId: '',
        dependees: [],
        dockerComposeFileService: { image: 'postgres:9.6-alpine', ports: [{ published: 5432, target: 5432 }] },
        dockestService: { serviceName: 'postgres', dependsOn: 'node' },
        logger: new Logger('postgres'),
      },
    }

    injectDependees(runners, runnersWithDependsOn)

    expect(runners).toMatchInlineSnapshot(`
      Object {
        "node": Object {
          "containerId": "",
          "dependees": Array [
            Object {
              "containerId": "",
              "dependees": Array [],
              "dockerComposeFileService": Object {
                "image": "postgres:9.6-alpine",
                "ports": Array [
                  Object {
                    "published": 5432,
                    "target": 5432,
                  },
                ],
              },
              "dockestService": Object {
                "dependsOn": "node",
                "serviceName": "postgres",
              },
              "logger": Logger {
                "debug": [Function],
                "error": [Function],
                "info": [Function],
                "runnerSymbol": "🦇 ",
                "serviceName": "postgres",
                "setRunnerSymbol": [Function],
                "warn": [Function],
              },
            },
          ],
          "dockerComposeFileService": Object {
            "image": "node:10-alpine",
            "ports": Array [
              Object {
                "published": 3000,
                "target": 3000,
              },
            ],
          },
          "dockestService": Object {
            "serviceName": "node",
          },
          "logger": Logger {
            "debug": [Function],
            "error": [Function],
            "info": [Function],
            "runnerSymbol": "🦇 ",
            "serviceName": "node",
            "setRunnerSymbol": [Function],
            "warn": [Function],
          },
        },
      }
    `)
  })
})
