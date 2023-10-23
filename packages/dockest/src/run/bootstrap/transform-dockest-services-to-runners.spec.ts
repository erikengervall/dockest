import { EventEmitter } from 'events';
import { transformDockestServicesToRunners } from './transform-dockest-services-to-runners';
import { DockerComposeFile, DockestService } from '../../@types';

const serviceName = 'service1';
const dockerComposeFile: DockerComposeFile = {
  version: '3.8',
  services: {
    [serviceName]: { ports: [{ published: 3000, target: 3000 }] },
  },
};
const dockestServices: DockestService[] = [{ serviceName: serviceName }];

describe('transformDockestServicesToRunners', () => {
  describe('happy', () => {
    it('should work', () => {
      const runners = transformDockestServicesToRunners({
        dockerComposeFile,
        dockestServices,
        runMode: 'host',
        dockerEventEmitter: new EventEmitter() as any,
      });

      expect(runners).toMatchInlineSnapshot(`
        {
          "service1": {
            "commands": [],
            "containerId": "",
            "dependsOn": [],
            "dockerComposeFileService": {
              "ports": [
                {
                  "published": 3000,
                  "target": 3000,
                },
              ],
            },
            "dockerEventStream$": Observable {
              "_isScalar": false,
              "operator": [Function],
              "source": Observable {
                "_isScalar": false,
                "_subscribe": [Function],
              },
            },
            "logger": Logger {
              "debug": [Function],
              "error": [Function],
              "info": [Function],
              "runnerSymbol": "🦇 ",
              "serviceName": "service1",
              "setRunnerSymbol": [Function],
              "warn": [Function],
            },
            "readinessCheck": [Function],
            "serviceName": "service1",
          },
        }
      `);
    });
  });

  describe('sad', () => {
    it(`should throw if serviceName can't be found in Compose file`, () => {
      const invalidServiceName = 'does-not-match--should-throw';
      const dockestServices: DockestService[] = [{ serviceName: invalidServiceName }];

      expect(() =>
        transformDockestServicesToRunners({
          dockerComposeFile,
          dockestServices,
          runMode: 'host',
          dockerEventEmitter: new EventEmitter() as any,
        }),
      ).toThrow(
        `Unable to find compose service "${invalidServiceName}", make sure that the serviceName corresponds with your Compose File's service`,
      );
    });
  });
});
