import { mergeComposeFiles } from './index'
import { createConfig } from '../../../test-utils'

const nodeProcess: any = { cwd: () => __dirname }

describe('mergeComposeFiles', () => {
  describe('happy', () => {
    it('should work for single compose file', async () => {
      const config = createConfig({}, { composeFile: ['mergeComposeFiles.spec.yml'] })

      const { mergedComposeFiles } = await mergeComposeFiles(config, nodeProcess)

      expect(mergedComposeFiles).toMatchInlineSnapshot(`
        "services:
          redis:
            image: redis:5.0.3-alpine
            ports:
            - published: 6379
              target: 6379
        version: '3.7'
        "
      `)
    })

    it('should work for multiple compose files', async () => {
      const config = createConfig({}, { composeFile: ['mergeComposeFiles.spec.yml', 'mergeComposeFiles2.spec.yml'] })

      const { mergedComposeFiles } = await mergeComposeFiles(config, nodeProcess)

      expect(mergedComposeFiles).toMatchInlineSnapshot(`
        "services:
          postgres:
            environment:
              POSTGRES_DB: nobueno
              POSTGRES_PASSWORD: is
              POSTGRES_USER: ramda
            image: postgres:9.6-alpine
            ports:
            - published: 5433
              target: 5432
          redis:
            image: redis:5.0.3-alpine
            ports:
            - published: 6379
              target: 6379
        version: '3.7'
        "
      `)
    })
  })

  describe('sad', () => {
    it('should throw if invalid name of compose file', async () => {
      const config = createConfig({}, { composeFile: ['invalid.yml'] })

      const promise = mergeComposeFiles(config, nodeProcess)

      await expect(promise).rejects.toThrow('Invalid Compose file(s)')
    })
  })
})
