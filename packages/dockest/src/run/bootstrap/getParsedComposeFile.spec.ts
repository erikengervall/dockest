import { getParsedComposeFile } from './getParsedComposeFile'
import { MERGED_COMPOSE_FILES, MERGED_COMPOSE_FILES_VERSION_2_3_3_PLUS } from '../../test-utils'

describe('getParsedComposeFile', () => {
  describe('with published ports as number', () => {
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

  describe('with published ports as string', () => {
    it('should work', () => {
      const { dockerComposeFile } = getParsedComposeFile(MERGED_COMPOSE_FILES_VERSION_2_3_3_PLUS)

      expect(dockerComposeFile).toMatchInlineSnapshot(`
        Object {
          "name": "application",
          "services": Object {
            "redis": Object {
              "image": "redis:5.0.3-alpine",
              "ports": Array [
                Object {
                  "published": "6379",
                  "target": 6379,
                },
              ],
            },
          },
        }
      `)
    })
  })
})
