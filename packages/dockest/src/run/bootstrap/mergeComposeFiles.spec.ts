import { mergeComposeFiles } from './mergeComposeFiles'

const nodeProcess: any = { cwd: () => __dirname }

describe('mergeComposeFiles', () => {
  describe('happy', () => {
    it('should work for single compose file', async () => {
      const { mergedComposeFiles } = await mergeComposeFiles({
        composeFile: 'mergeComposeFiles.spec.yml',
        nodeProcess,
      })

      expect(mergedComposeFiles).toMatchInlineSnapshot(`
        "services:
          redis:
            image: redis:5.0.3-alpine
            ports:
            - protocol: tcp
              published: 6379
              target: 6379
        version: '3.8'
        "
      `)
    })

    it('should work for multiple compose files', async () => {
      const { mergedComposeFiles } = await mergeComposeFiles({
        composeFile: ['mergeComposeFiles.spec.yml', 'mergeComposeFiles2.spec.yml'],
        nodeProcess,
      })

      expect(mergedComposeFiles).toMatchInlineSnapshot(`
        "services:
          postgres:
            environment:
              POSTGRES_DB: nobueno
              POSTGRES_PASSWORD: is
              POSTGRES_USER: ramda
            image: postgres:9.6-alpine
            ports:
            - protocol: tcp
              published: 5433
              target: 5432
          redis:
            image: redis:5.0.3-alpine
            ports:
            - protocol: tcp
              published: 6379
              target: 6379
        version: '3.8'
        "
      `)
    })
  })

  describe('sad', () => {
    it('should throw if invalid name of compose file', async () => {
      const promise = mergeComposeFiles({
        composeFile: 'this-file-does-not-exist.yml',
        nodeProcess,
      })

      await expect(promise).rejects.toThrow('Invalid Compose file(s)')
    })
  })
})
