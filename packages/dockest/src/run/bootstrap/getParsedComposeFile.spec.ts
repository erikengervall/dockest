import { getParsedComposeFile } from './getParsedComposeFile'
import { MERGED_COMPOSE_FILES } from '../../test-utils'

describe('getParsedComposeFile', () => {
  describe('happy', () => {
    it('should work', () => {
      const { dockerComposeFile } = getParsedComposeFile(MERGED_COMPOSE_FILES)

      expect(dockerComposeFile).toMatchInlineSnapshot(`
        Object {
          "services": Object {
            "redis": Object {
              "image": "redis:5.0.3-alpine",
              "ports": Array [
                Object {
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
  })
})
