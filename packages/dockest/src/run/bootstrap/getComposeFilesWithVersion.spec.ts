import { getComposeFilesWithVersion } from './getComposeFilesWithVersion'

const nodeProcess: any = { cwd: () => __dirname }

const mergedComposeFiles = `services:
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
    name: bootstrap_default`

describe('getComposeFilesWithVersion', () => {
  it('should inject version into the mergedComposeFiles', () => {
    const { mergedComposeFilesWithVersion } = getComposeFilesWithVersion(
      'mergeComposeFiles.spec.yml',
      mergedComposeFiles,
      nodeProcess,
    )

    expect(mergedComposeFilesWithVersion).toMatchInlineSnapshot(`
      "version: \\"3.8\\"
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
          name: bootstrap_default"
    `)
  })
})
