import { parseComposeFile } from './parseComposeFile'
import { MERGED_COMPOSE_FILES } from '../../test-utils'

describe('parseComposeFile', () => {
  describe('happy', () => {
    it('should work', () => {
      const result = parseComposeFile(MERGED_COMPOSE_FILES)

      expect(result).toMatchInlineSnapshot(`
        Object {
          "composeFileAsObject": Object {
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
            "version": "3.7",
          },
        }
      `)
    })
  })
})
