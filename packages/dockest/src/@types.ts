import { Observable } from 'rxjs'
import { Logger } from './Logger'
import { DockerEventEmitter } from './run/bootstrap/createDockerEventEmitter'
import { DockerServiceEventStream } from './run/bootstrap/createDockerServiceEventStream'
import { LogWriterModeType } from './run/log-writer'

type ContainerId = string
type ServiceName = string

export interface ReadinessCheck {
  (args: { runner: Runner }): Promise<any> | Observable<any>
}

export interface Runner {
  commands: Commands
  containerId: ContainerId
  dependents: Runner[]
  dockerComposeFileService: DockerComposeFileService
  dockerEventStream$: DockerServiceEventStream
  logger: Logger
  readinessCheck: ReadinessCheck
  serviceName: ServiceName
  host?: string
  isBridgeNetworkMode?: boolean
}

export interface RunnersObj {
  [key: string]: Runner
}

export type DockerComposePortStringFormat = string
export type DockerComposePortObjectFormat = {
  /** The publicly exposed port */
  published: number
  /** The port inside the container */
  target: number
}

export type DockerComposePortFormat = DockerComposePortStringFormat | DockerComposePortObjectFormat

export interface DockerComposeFileService {
  /** Expose ports */
  ports?: DockerComposePortFormat[]
  [key: string]: any
}

export interface DockerComposeFile {
  version: string
  services: {
    [key: string]: DockerComposeFileService
  }
}

export type Commands = (string | ((containerId: string) => string))[]

export interface DockestService {
  serviceName: ServiceName
  commands?: Commands
  dependents?: DockestService[]
  readinessCheck?: ReadinessCheck
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
  /** Skip port connectivity checks */
  skipCheckConnection: boolean

  jestLib: Jest

  containerLogs: {
    /** Method for gathering logs
     * "per-service": One log file per service
     * "aggregate": One log file for all services
     * "pipe-stdout": Pipe logs to stdout
     */
    modes: LogWriterModeType[]
    /** Only collect logs for the specified services. */
    serviceNameFilter?: string[]
    /** Where should the logs be written to? Defaults to "./" */
    logPath: string
  }

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

export type TestRunModeType = 'docker-local-socket' | 'docker-injected-host-socket' | 'host'

interface InternalConfig {
  hostname: string
  runMode: TestRunModeType
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
