import { getParsedComposeFile } from './getParsedComposeFile';

const COMPOSE_FILE = `
version: '3.8'
services:
  redis:
    image: redis:5.0.3-alpine
    ports:
      - published: 6379
        target: 6379
`;
const COMPOSE_FILE2 = `
version: '3.8'
services:
  redis:
    image: redis:5.0.3-alpine
    ports:
      - published: 6379
        target: '6379'
`;
const COMPOSE_FILE_WITH_OLD_PORT_FORMAT = `
version: '3.8'
services:
  redis_old:
    image: redis:5.0.3-alpine
    ports:
      - 6379:1337
`;

describe('getParsedComposeFile', () => {
  describe('happy', () => {
    it('should work', () => {
      const { dockerComposeFile } = getParsedComposeFile(COMPOSE_FILE);

      expect(dockerComposeFile).toMatchInlineSnapshot(`
        {
          "services": {
            "redis": {
              "image": "redis:5.0.3-alpine",
              "ports": [
                {
                  "published": 6379,
                  "target": 6379,
                },
              ],
            },
          },
          "version": "3.8",
        }
      `);
    });

    it('should handle string ports', () => {
      const { dockerComposeFile } = getParsedComposeFile(COMPOSE_FILE2);

      expect(dockerComposeFile).toMatchInlineSnapshot(`
        {
          "services": {
            "redis": {
              "image": "redis:5.0.3-alpine",
              "ports": [
                {
                  "published": 6379,
                  "target": 6379,
                },
              ],
            },
          },
          "version": "3.8",
        }
      `);
    });

    it('should throw error for old port format', () => {
      try {
        getParsedComposeFile(COMPOSE_FILE_WITH_OLD_PORT_FORMAT);

        expect(true).toEqual(false);
      } catch (error) {
        expect((error as any).message).toMatchInlineSnapshot(`
          "[
            {
              "code": "invalid_type",
              "expected": "object",
              "received": "string",
              "path": [
                "services",
                "redis_old",
                "ports",
                0
              ],
              "message": "Expected object, received string"
            }
          ]"
        `);
      }
    });
  });
});
