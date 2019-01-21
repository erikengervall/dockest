import { IPostgresRunnerConfig } from './PostgresRunner'

export interface IRunner {
  setup: (runnerKey: string) => Promise<void>
  teardown: (runnerKey: string) => Promise<void>
  getHelpers: () => Promise<{
    clear?: () => boolean
    loadData?: () => boolean
  }>
}

export interface IExec {
  start: (runnerConfig: IPostgresRunnerConfig) => Promise<string>
  checkHealth: (containerId: string, runnerConfig: IPostgresRunnerConfig) => Promise<void>
  teardown: (containerId: string, runnerKey: string) => Promise<void>
}
