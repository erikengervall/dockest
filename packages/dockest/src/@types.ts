import { Logger } from './Logger'
import { DockerEventEmitter } from './run/bootstrap/createDockerEventEmitter'
import { DockerServiceEventStream } from './run/bootstrap/createDockerServiceEventStream'

type ContainerId = string
type DefaultHealthcheck = () => Promise<void>
type ServiceName = string

export interface DefaultHealthchecks {
  postgres: DefaultHealthcheck
  redis: DefaultHealthcheck
  web: DefaultHealthcheck
}

export interface Healthcheck {
  ({
    containerId,
    defaultHealthchecks,
    dockerComposeFileService,
    dockerEventStream$,
    logger,
  }: {
    containerId: ContainerId
    defaultHealthchecks: DefaultHealthchecks
    dockerComposeFileService: DockerComposeFileService
    dockerEventStream$: DockerServiceEventStream
    logger: Runner['logger']
  }): Promise<any>
}

export interface Runner {
  commands: Commands
  containerId: ContainerId
  dependents: Runner[]
  dockerComposeFileService: DockerComposeFileService
  dockerEventStream$: DockerServiceEventStream
  healthcheck: Healthcheck
  logger: Logger
  serviceName: ServiceName
  host?: string
  isBridgeNetworkMode?: boolean
}

export interface RunnersObj {
  [key: string]: Runner
}

export interface DockerComposeFileService {
  ports: {
    published: number
    target: number
  }[]
  [key: string]: any
}

export interface DockerComposeFile {
  version: string
  services: {
    [key: string]: DockerComposeFileService
  }
}

export interface DockerComposeFileServicePostgres extends DockerComposeFileService {
  environment?: {
    POSTGRES_DB?: string
    POSTGRES_PASSWORD?: string
    POSTGRES_USER?: string
  }
}

export type Commands = (string | ((containerId: string) => string))[]

export interface DockestService {
  serviceName: ServiceName
  commands?: Commands
  dependents?: DockestService[]
  healthcheck?: Healthcheck
}

export interface MutablesConfig {
  /** Jest has finished executing and has returned a result */
  jestRanWithResult: boolean
  runners: RunnersObj
  dockerEventEmitter: DockerEventEmitter
}

type Jest = typeof import('jest')
type JestOpts = Partial<Parameters<Jest['runCLI']>[0]>

export interface DockestOpts {
  composeFile: string | string[]
  logLevel: number
  /** Run dockest sequentially */
  runInBand: boolean

  jestLib: Jest

  composeOpts: {
    /** Recreate dependent containers. Incompatible with --no-recreate. */
    alwaysRecreateDeps: boolean
    /** Build images before starting containers. */
    build: boolean
    /** Recreate containers even if their configuration and image haven't changed. */
    forceRecreate: boolean
    /** Don't build an image, even if it's missing. */
    noBuild: boolean
    /** Produce monochrome output. */
    noColor: boolean
    /** Don't start linked services. */
    noDeps: boolean
    /** If containers already exist, don't recreate them. Incompatible with --force-recreate and -V. */
    noRecreate: boolean
    /** Pull without printing progress information. */
    quietPull: boolean
  }

  debug?: boolean
  dumpErrors?: boolean
  exitHandler?: null | ((error: ErrorPayload) => any)

  /** https://jestjs.io/docs/en/cli */
  jestOpts: JestOpts
}

interface InternalConfig {
  hostname: string
  isInsideDockerContainer: boolean
  perfStart: number
}

export interface DockestConfig extends InternalConfig, DockestOpts {
  jestOpts: JestOpts
  mutables: MutablesConfig
}

export interface ErrorPayload {
  trap: string
  code?: number
  error?: Error
  promise?: Promise<any>
  reason?: Error | any
  signal?: any
}
