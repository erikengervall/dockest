import { DEFAULT_OPTS, DEFAULT_$ } from './constants'
import { DockestConfig, DockestService, DockerComposeFile, Runner } from './@types'
import { Logger } from './Logger'

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

export const createRunner = (overrides?: Partial<Runner>): Runner => ({
  commands: [],
  containerId: '',
  dependents: [],
  dockerComposeFileService: { image: 'node:10-alpine', ports: [{ published: 3000, target: 3000 }] },
  healthchecks: [],
  logger: new Logger('node'),
  serviceName: 'node',
  ...(overrides || {}),
})

export const DOCKEST_SERVICE: DockestService = {
  serviceName: 'redis',
}

export const DOCKER_COMPOSE_FILE: DockerComposeFile = {
  version: '3.7',
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
