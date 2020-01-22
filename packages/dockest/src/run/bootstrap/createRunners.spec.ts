import { createRunners } from './createRunners'
import { createConfig, DOCKER_COMPOSE_FILE, DOCKEST_SERVICE } from '../../test-utils'

const config = createConfig({ dockestServices: [DOCKEST_SERVICE] }, {})

describe('createRunners', () => {
  describe('happy', () => {
    it('should work', () => {
      const runners = createRunners(config, DOCKER_COMPOSE_FILE)

      expect(runners).toMatchInlineSnapshot(`
        Object {
          "runners": Object {
            "redis": Object {
              "containerId": "",
              "dependees": Array [],
              "dockerComposeFileService": Object {
                "image": "redis:5.0.3-alpine",
                "ports": Array [
                  Object {
                    "published": 6379,
                    "target": 6379,
                  },
                ],
              },
              "dockestService": Object {
                "serviceName": "redis",
              },
              "logger": Logger {
                "debug": [Function],
                "error": [Function],
                "info": [Function],
                "runnerSymbol": "🦇 ",
                "serviceName": "redis",
                "setRunnerSymbol": [Function],
                "warn": [Function],
              },
            },
          },
          "runnersWithDependsOn": Object {},
        }
      `)
    })
  })

  describe('sad', () => {
    it('should throw if ', () => {
      const config = createConfig({ dockestServices: [{ ...DOCKEST_SERVICE, serviceName: 'invalid' }] })

      expect(() => createRunners(config, DOCKER_COMPOSE_FILE)).toThrow(
        `Unable to find compose service "${config.$.dockestServices[0].serviceName}", make sure that the serviceName corresponds with your Compose File's service`,
      )
    })
  })
})
