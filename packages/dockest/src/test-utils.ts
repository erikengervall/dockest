import { DEFAULT_OPTS, DEFAULT_$ } from './constants'
import { DockestConfig, DockestService, DockerComposeFile } from './@types'

export const createConfig = (
  $: Partial<DockestConfig['$']> = {},
  opts: Partial<DockestConfig['opts']> = {},
): DockestConfig => ({
  $: {
    ...DEFAULT_$,
    ...$,
  },
  opts: {
    ...DEFAULT_OPTS,
    jestLib: jest.fn() as any,
    ...opts,
  },
})

export const DOCKEST_SERVICE: DockestService = {
  serviceName: 'redis',
}

export const DOCKER_COMPOSE_FILE: DockerComposeFile = {
  services: {
    [DOCKEST_SERVICE.serviceName]: {
      image: 'redis:5.0.3-alpine',
      ports: [
        {
          published: 6379,
          target: 6379,
        },
      ],
    },
  },
  version: '3.7',
}

export const MERGED_COMPOSE_FILES = `
services:
  redis:
    image: redis:5.0.3-alpine
    ports:
    - published: 6379
      target: 6379
version: '3.7'
`
