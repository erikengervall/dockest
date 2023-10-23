import { getComposeFilesWithVersion } from './getComposeFilesWithVersion'
import { DOCKER_COMPOSE_FILE } from '../../test-utils'

const nodeProcess: any = { cwd: () => __dirname }

describe('getComposeFilesWithVersion', () => {
  it('should inject version into the mergedComposeFiles if "docker compose config" trimmed version', () => {
    const { dockerComposeFileWithVersion } = getComposeFilesWithVersion(
      'mergeComposeFiles.spec.yml',
      { ...DOCKER_COMPOSE_FILE, version: undefined },
      nodeProcess,
    )

    expect(dockerComposeFileWithVersion).toMatchInlineSnapshot(`
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

  it('should not inject version into the mergedComposeFiles it wasnt trimmed', () => {
    const { dockerComposeFileWithVersion } = getComposeFilesWithVersion(
      'mergeComposeFiles.spec.yml',
      { ...DOCKER_COMPOSE_FILE, version: '3.9' },
      nodeProcess,
    )

    expect(dockerComposeFileWithVersion).toMatchInlineSnapshot(`
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
        "version": "3.9",
      }
    `)
  })
})
