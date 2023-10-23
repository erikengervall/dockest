import { getParsedComposeFile } from './getParsedComposeFile'

const COMPOSE_FILE = `
version: '3.8'
services:
  redis:
    image: redis:5.0.3-alpine
    ports:
      - published: 6379
        target: 6379
`
const COMPOSE_FILE2 = `
version: '3.8'
services:
  redis:
    image: redis:5.0.3-alpine
    ports:
      - published: 6379
        target: '6379'
`
const COMPOSE_FILE_WITH_OLD_PORT_FORMAT = `
version: '3.8'
services:
  redis_old:
    image: redis:5.0.3-alpine
    ports:
      - 6379:1337
`

describe('getParsedComposeFile', () => {
  describe('happy', () => {
    it('should work', () => {
      const { dockerComposeFile } = getParsedComposeFile(COMPOSE_FILE)

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
      `)
    })

    it('should handle string ports', () => {
      const { dockerComposeFile } = getParsedComposeFile(COMPOSE_FILE2)

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
      `)
    })

    it('should throw error for old port format', () => {
      try {
        getParsedComposeFile(COMPOSE_FILE_WITH_OLD_PORT_FORMAT)

        expect(true).toEqual(false)
      } catch (error) {
        expect((error as any).message).toMatchInlineSnapshot(`
          "Invalid schema. 
          - Could not decode the port mappings. This is most likely related to a breaking change in the docker-compose format.
          Received: "6379:1337"
          Are you using the Long Port Format (https://docs.docker.com/compose/compose-file/compose-file-v3/#long-syntax-1)? If you are and are still experiencing issues, please report this issue on the dockest issue tracker: https://github.com/erikengervall/dockest/issues"
        `)
      }
    })
  })
})
