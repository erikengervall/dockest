import { Logger } from './Logger'

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
    logger,
  }: {
    containerId: ContainerId
    defaultHealthchecks: DefaultHealthchecks
    dockerComposeFileService: DockerComposeFileService
    logger: Runner['logger']
  }): Promise<any>
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

export interface Glob {
  jestRanWithResult: DockestConfig['jestRanWithResult']
  runners: RunnersObj
}

export interface DockestConfig {
  hostname: string
  isInsideDockerContainer: boolean
  /** Jest has finished executing and has returned a result */
  jestRanWithResult: boolean
  perfStart: number
  composeFile: string | string[]
  logLevel: number
  /** Run dockest sequentially */
  runInBand: boolean

  // FIXME: Proper typings for Jest without introducing circular referencing
  jestLib: {
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

  debug?: boolean
  dumpErrors?: boolean
  exitHandler?: null | ((error: ErrorPayload) => any)

  /** https://jestjs.io/docs/en/cli */
  jestOpts: {
    projects: string[]
    runInBand: boolean
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
    reporters?: boolean
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

export interface ErrorPayload {
  trap: string
  code?: number
  error?: Error
  promise?: Promise<any>
  reason?: Error | any
  signal?: any
}
