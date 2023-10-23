import { safeLoad } from 'js-yaml';
import { mergeComposeFiles } from './merge-compose-files';

const nodeProcess: any = { cwd: () => __dirname };

/**
 * Some notes on the recent V2 docker-compose config update and how it affects Dockest
 * @ref https://github.com/erikengervall/dockest/issues/283
 */

/** compose-file.yml
 version: '3.8'

 services:
   redis:
     image: redis:5.0.3-alpine
     ports:
       - 6379:6379/tcp
 */

/** pre V2 docker-compose config
services:
  redis:
    image: redis:5.0.3-alpine
    ports:
    - protocol: tcp
      published: 6379
      target: 6379
version: '3.8'
 */

/** post V2 docker-compose config
services:
  redis:
    image: redis:5.0.3-alpine
    networks:
      default: null
    ports:
    - mode: ingress
      target: 6379
      published: 6379
      protocol: tcp
networks:
  default:
    name: bootstrap_default
 */

describe('mergeComposeFiles', () => {
  describe('happy', () => {
    it('should work for single compose file', async () => {
      const { mergedComposeFiles } = await mergeComposeFiles('merge-compose-files.spec.yml', nodeProcess);

      expect(safeLoad(mergedComposeFiles)).toMatchObject({
        networks: {
          default: {
            name: 'bootstrap_default',
          },
        },
        services: {
          redis: {
            image: 'redis:5.0.3-alpine',
            networks: {
              default: null,
            },
            ports: [
              {
                protocol: 'tcp',
                published: '6379',
                target: 6379,
              },
            ],
          },
        },
        name: 'bootstrap',
      });
    });

    it('should work for multiple compose files', async () => {
      const { mergedComposeFiles } = await mergeComposeFiles(
        ['merge-compose-files.spec.yml', 'merge-compose-files-2.spec.yml'],
        nodeProcess,
      );

      expect(safeLoad(mergedComposeFiles)).toMatchObject({
        name: 'bootstrap',
        networks: {
          default: {
            name: 'bootstrap_default',
          },
        },
      });

      // services: {
      //   postgres: expect.objectContaining({
      //     environment: {
      //       POSTGRES_DB: 'nobueno',
      //       POSTGRES_PASSWORD: 'is',
      //       POSTGRES_USER: 'ramda',
      //     },
      //     image: 'postgres:9.6-alpine',
      //     networks: {
      //       default: null,
      //     },
      //     ports: [
      //       {
      //         protocol: 'tcp',
      //         published: '5433',
      //         target: 5432,
      //       },
      //     ],
      //   }),
      //   redis: expect.objectContaining({
      //     image: 'redis:5.0.3-alpine',
      //     networks: {
      //       default: null,
      //     },
      //     ports: [
      //       {
      //         protocol: 'tcp',
      //         published: '6379',
      //         target: 6379,
      //       },
      //     ],
      //   }),
      // },
    });
  });

  describe('sad', () => {
    it('should throw if invalid name of compose file', async () => {
      try {
        await mergeComposeFiles('this-file-does-not-exist.yml', nodeProcess);
        expect(true).toBe('Should throw.');
      } catch (error) {
        expect(error).toMatchInlineSnapshot(`[DockestError: Invalid Compose file(s)]`);
      }
    });
  });
});
