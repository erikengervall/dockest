import PostgresRunner from './PostgresRunner'

export interface IRunners {
  [key: string]: PostgresRunner
}

export { PostgresRunner }
