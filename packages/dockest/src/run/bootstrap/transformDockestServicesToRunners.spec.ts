import { transformDockestServicesToRunners } from './transformDockestServicesToRunners'
import { createConfig, DOCKER_COMPOSE_FILE, DOCKEST_SERVICE } from '../../test-utils'

const config = createConfig({ dockestServices: [DOCKEST_SERVICE] }, {})

describe('transformDockestServicesToRunners', () => {
  describe('happy', () => {
    it('should work', () => {
      transformDockestServicesToRunners(config, DOCKER_COMPOSE_FILE)

      expect(config.$.runners).toMatchInlineSnapshot(`
        Object {
          "redis": Object {
            "commands": Array [],
            "containerId": "",
            "dependents": Array [],
            "dockerComposeFileService": Object {
              "image": "redis:5.0.3-alpine",
              "ports": Array [
                Object {
                  "published": 6379,
                  "target": 6379,
                },
              ],
            },
            "healthcheck": [Function],
            "logger": Logger {
              "debug": [Function],
              "error": [Function],
              "info": [Function],
              "runnerSymbol": "🦇 ",
              "serviceName": "redis",
              "setRunnerSymbol": [Function],
              "warn": [Function],
            },
            "serviceName": "redis",
          },
        }
      `)
    })
  })

  describe('sad', () => {
    it('should throw if ', () => {
      const config = createConfig({ dockestServices: [{ ...DOCKEST_SERVICE, serviceName: 'invalid' }] })

      expect(() => transformDockestServicesToRunners(config, DOCKER_COMPOSE_FILE)).toThrow(
        `Unable to find compose service "${config.$.dockestServices[0].serviceName}", make sure that the serviceName corresponds with your Compose File's service`,
      )
    })
  })
})
