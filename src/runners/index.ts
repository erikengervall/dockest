import KafkaRunner from './KafkaRunner'
import PostgresRunner from './PostgresRunner'
import ZookeeperRunner from './ZookeeperRunner'

export interface IBaseRunner {
  /**
   * Start containers
   * Healthcheck containers
   */
  setup: (runnerKey: string) => Promise<void>
  /**
   * Teardown resources
   * Stop containers
   * Remove containers
   */
  teardown: (runnerKey: string) => Promise<void>
}

export interface IRunners {
  /**
   * `runnerKey` is a user-provided identifier for a runner instance
   * it's relevant since a user can instantiate multiple runners of the same type
   */
  [runnerKey: string]: PostgresRunner | KafkaRunner | ZookeeperRunner
}

export { KafkaRunner, PostgresRunner, ZookeeperRunner }
