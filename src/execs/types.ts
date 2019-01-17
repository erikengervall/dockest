import { IPostgresRunnerConfig } from '../runners/postgres'

export interface IBaseExecs {
  start: (runnerConfig: IPostgresRunnerConfig) => Promise<string>
  checkResponsiveness: (containerId: string, runnerConfig: IPostgresRunnerConfig) => Promise<void>
  checkConnection: (runnerConfig: IPostgresRunnerConfig) => Promise<void>
  teardown: (containerId?: string) => Promise<void>
}
