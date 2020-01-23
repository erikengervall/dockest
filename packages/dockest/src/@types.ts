import { Logger } from './Logger'

type ServiceName = string
type ContainerId = string

export interface DefaultHealthchecks {
  postgres: (composeService: DockerComposeFileServicePostgres) => Promise<void>
  redis: (composeService: DockerComposeFileService) => Promise<void>
  web: (composeService: DockerComposeFileService) => Promise<void>
}

export interface Healthcheck<T = DockerComposeFileService> {
  (composeService: T, containerId: ContainerId, defaultHealthchecks: DefaultHealthchecks): Promise<void>
}

export interface Runner {
  commands: Commands
  containerId: ContainerId
  dependents: Runner[]
  dockerComposeFileService: DockerComposeFileService
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

export type Commands = string[]

export interface DockestService {
  serviceName: ServiceName
  commands?: Commands
  dependents?: DockestService[]
  healthcheck?: Healthcheck
}

export interface DockestConfig {
  $: {
    dockestServices: DockestService[]
    hostname: string
    isInsideDockerContainer: boolean
    /** Jest has finished executing and has returned a result */
    jestRanWithResult: boolean
    perfStart: number
    runners: RunnersObj
  }
  opts: {
    composeFile: string | string[]
    logLevel: number
    /** Run dockest sequentially */
    runInBand: boolean

    jestLib: {
      // FIXME: Proper typings for Jest without introducing circular referencing
      SearchSource: any
      TestScheduler: any
      TestWatcher: any
      getVersion: () => string
      run: (maybeArgv?: string[] | undefined, project?: string | undefined) => Promise<any>
      runCLI: (argv: any, projects: string[]) => Promise<any>
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

    afterSetupSleep?: number
    debug?: boolean
    dumpErrors?: boolean
    exitHandler?: null | ((error: ErrorPayload) => any)

    /** https://jestjs.io/docs/en/cli */
    jestOpts?: {
      bail?: boolean
      cache?: boolean
      changedFilesWithAncestor?: boolean
      changedSince?: string
      ci?: boolean
      clearCache?: boolean
      collectCoverageFrom?: string
      colors?: boolean
      config?: string
      coverage?: boolean
      debug?: boolean
      detectOpenHandles?: boolean
      env?: string
      errorOnDeprecated?: boolean
      expand?: boolean
      findRelatedTests?: string
      forceExit?: boolean
      help?: boolean
      init?: boolean
      json?: boolean
      lastCommit?: boolean
      listTests?: boolean
      logHeapUsage?: boolean
      maxConcurrency?: number
      maxWorkers?: number | string
      noStackTrace?: boolean
      notify?: boolean
      onlyChanged?: boolean
      outputFile?: string
      passWithNoTests?: boolean
      projects?: string[]
      reporters?: boolean
      runInBand?: boolean
      runTestsByPath?: boolean
      setupTestFrameworkScriptFile?: string
      showConfig?: boolean
      silent?: boolean
      testLocationInResults?: boolean
      testNamePattern?: string
      testPathIgnorePatterns?: string[]
      testPathPattern?: string
      testRunner?: string
      testSequencer?: string
      testTimeout?: number
      updateSnapshot?: boolean
      useStderr?: boolean
      verbose?: boolean
      version?: boolean
      watch?: boolean
      watchAll?: boolean
      watchman?: boolean
    }
  }
}

export interface ErrorPayload {
  trap: string
  code?: number
  error?: Error
  promise?: Promise<any>
  reason?: Error | any
  signal?: any
}
