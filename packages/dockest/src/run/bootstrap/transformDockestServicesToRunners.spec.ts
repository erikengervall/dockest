import { EventEmitter } from 'events'
import { transformDockestServicesToRunners } from './transformDockestServicesToRunners'
import { DockestService, DockerComposeFile } from '../../@types'
import { getOpts } from '../../utils/getOpts'

const { isInsideDockerContainer } = getOpts()

const serviceName = 'service1'
const dockerComposeFile: DockerComposeFile = {
  version: '3.7',
  services: {
    [serviceName]: { ports: [{ published: 3000, target: 3000 }] },
  },
}
const dockestServices: DockestService[] = [{ serviceName: serviceName }]

describe('transformDockestServicesToRunners', () => {
  describe('happy', () => {
    it('should work', () => {
      const runners = transformDockestServicesToRunners({
        dockerComposeFile,
        dockestServices,
        isInsideDockerContainer,
        dockerEventEmitter: new EventEmitter() as any,
      })

      expect(runners).toMatchInlineSnapshot(`
        Object {
          "service1": Object {
            "commands": Array [],
            "containerId": "",
            "dependents": Array [],
            "dockerComposeFileService": Object {
              "ports": Array [
                Object {
                  "published": 3000,
                  "target": 3000,
                },
              ],
            },
            "healthcheck": [Function],
            "logger": Logger {
              "debug": [Function],
              "error": [Function],
              "info": [Function],
              "runnerSymbol": "🦇 ",
              "serviceName": "service1",
              "setRunnerSymbol": [Function],
              "warn": [Function],
            },
            "serviceName": "service1",
          },
        }
      `)
    })
  })

  describe('sad', () => {
    it(`should throw if serviceName can't be found in Compose file`, () => {
      const invalidServiceName = 'does-not-match--should-throw'
      const dockestServices: DockestService[] = [{ serviceName: invalidServiceName }]

      expect(() =>
        transformDockestServicesToRunners({
          dockerComposeFile,
          dockestServices,
          isInsideDockerContainer,
          dockerEventEmitter: new EventEmitter() as any,
        }),
      ).toThrow(
        `Unable to find compose service "${invalidServiceName}", make sure that the serviceName corresponds with your Compose File's service`,
      )
    })
  })
})
