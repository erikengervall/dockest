import { mergeComposeFiles } from './mergeComposeFiles'

const nodeProcess: any = { cwd: () => __dirname }

describe('mergeComposeFiles', () => {
  describe('happy', () => {
    it('should work for single compose file', async () => {
      const { mergedComposeFiles } = await mergeComposeFiles('mergeComposeFiles.spec.yml', nodeProcess)

      expect(mergedComposeFiles).toMatchInlineSnapshot(`
        "services:
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
            name: bootstrap_default"
      `)
    })

    it('should work for multiple compose files', async () => {
      const { mergedComposeFiles } = await mergeComposeFiles(
        ['mergeComposeFiles.spec.yml', 'mergeComposeFiles2.spec.yml'],
        nodeProcess,
      )

      expect(mergedComposeFiles).toMatchInlineSnapshot(`
        "services:
          postgres:
            environment:
              POSTGRES_DB: nobueno
              POSTGRES_PASSWORD: is
              POSTGRES_USER: ramda
            image: postgres:9.6-alpine
            networks:
              default: null
            ports:
            - mode: ingress
              target: 5432
              published: 5433
              protocol: tcp
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
            name: bootstrap_default"
      `)
    })
  })

  describe('sad', () => {
    it('should throw if invalid name of compose file', async () => {
      const promise = mergeComposeFiles('this-file-does-not-exist.yml', nodeProcess)

      await expect(promise).rejects.toThrow('Invalid Compose file(s)')
    })
  })
})
