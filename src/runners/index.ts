import KafkaRunner from './KafkaRunner'
import PostgresRunner from './PostgresRunner'
import ZookeeperRunner from './ZookeeperRunner'

export interface IBaseRunner {
  setup: (runnerKey: string) => Promise<void>
  teardown: (runnerKey: string) => Promise<void>
  getHelpers: () => Promise<{
    clear?: () => boolean
    loadData?: () => boolean
  }>
}

export interface IRunners {
  [key: string]: PostgresRunner | KafkaRunner | ZookeeperRunner
}

export { KafkaRunner, PostgresRunner, ZookeeperRunner }
