import { IPostgresRunnerConfig } from '../runners/postgres'

export interface IBaseExecs {
  start: (runnerConfig: IPostgresRunnerConfig) => Promise<string>
  checkHealth: (containerId: string, runnerConfig: IPostgresRunnerConfig) => Promise<void>
  teardown: (containerId?: string) => Promise<void>
}
