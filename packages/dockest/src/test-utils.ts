import { ReplaySubject } from 'rxjs'
import { DockestService, DockerComposeFile, Runner } from './@types'
import { Logger } from './Logger'

export const createRunner = (overrides?: Partial<Runner>): Runner => ({
  commands: [],
  containerId: '',
  dependents: [],
  dockerComposeFileService: { image: 'node:10-alpine', ports: [{ published: 3000, target: 3000 }] },
  healthcheck: () => Promise.resolve(),
  logger: new Logger('node'),
  serviceName: 'node',
  ...(overrides || {}),
  dockerEventStream$: new ReplaySubject(),
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
