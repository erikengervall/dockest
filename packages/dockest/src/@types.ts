import { Logger } from './Logger'

export interface Runner {
  dockerComposeFileService: DockerComposeFileService
  dockestService: DockestService
  logger: Logger
  containerId?: string
  host?: string
  isBridgeNetworkMode?: boolean
}

export interface DockerComposeFileService {
  ports: {
    published: number
    target: number
  }[]
  [key: string]: any
}

export interface ErrorPayload {
  trap: string
  code?: number
  error?: Error
  promise?: Promise<any>
  reason?: Error | any
  signal?: any
}

export interface DockerComposeFile {
  version: string
  services: {
    [key: string]: DockerComposeFileService
  }
}

export interface Healthcheck {
  (composeService: DockerComposeFileService, containerId: string): string
}

export interface DockestService {
  [key: string]: any
  serviceName: string
  commands: string[]
  healthchecks: Healthcheck[]
}

export interface DockestConfig {
  $: {
    dockestServices: DockestService[]
    hostname: string
    isInsideDockerContainer: boolean
    /**
     * Jest has finished executing and has returned a result
     */
    jestRanWithResult: boolean
    perfStart: number
    runners: Runner[]
  }
  opts: {
    composeFile: string | string[]
    jestLib: {
      // FIXME: Proper typings for Jest without introducing circular referencing
      SearchSource: any
      TestScheduler: any
      TestWatcher: any
      getVersion: () => string
      run: (maybeArgv?: string[] | undefined, project?: string | undefined) => Promise<any>
      runCLI: (argv: any, projects: string[]) => Promise<any>
    }

    logLevel: number
    afterSetupSleep?: number
    debug?: boolean
    dumpErrors?: boolean
    exitHandler?: null | ((error: ErrorPayload) => any)
    /**
     * https://jestjs.io/docs/en/cli
     */
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
    runInBand?: boolean
  }
}
